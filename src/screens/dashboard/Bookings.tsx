import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { getItem } from "../../storage/mmkv";
import {
    showUpcomingBookingReminder,
    cleanupOldReminders,
} from "../../services/bookingReminder";
import { useFocusEffect } from "@react-navigation/native";

type Booking = {
    id: string;
    name: string;
    phone: string;
    email: string;

    pickupDate: string;
    pickupTime: string;
    dropDate: string;

    pickupLocation: {
        latitude: number;
        longitude: number;
        address: string;
    } | null;

    dropLocation: {
        latitude: number;
        longitude: number;
        address: string;
    } | null;
};

const Bookings = ({ navigation }: any) => {
    const [today, setToday] = useState<Booking[]>([]);
    const [tomorrow, setTomorrow] = useState<Booking[]>([]);
    const [later, setLater] = useState<Booking[]>([]);
    const [past, setPast] = useState<Booking[]>([]);

    useFocusEffect(
        useCallback(() => {
            cleanupOldReminders();
            setTimeout(showUpcomingBookingReminder, 300);
        }, [])
    );

    useEffect(() => {
        loadBookings();
    }, []);

    const getPickupDateTime = (b: Booking) => {
        if (!b.pickupDate || !b.pickupTime) return null;
        const [h, m] = b.pickupTime.split(":").map(Number);
        const d = new Date(b.pickupDate);
        d.setHours(h, m, 0, 0);
        return isNaN(d.getTime()) ? null : d;
    };

    const loadBookings = () => {
        const json = getItem("bookings");
        if (!json) return;

        const all: Booking[] = JSON.parse(json);

        const t: Booking[] = [];
        const tm: Booking[] = [];
        const l: Booking[] = [];
        const p: Booking[] = [];

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const startOfDayAfterTomorrow = new Date(startOfTomorrow);
        startOfDayAfterTomorrow.setDate(startOfDayAfterTomorrow.getDate() + 1);

        all.forEach((b) => {
            const pickup = getPickupDateTime(b);
            if (!pickup) return p.push(b);
            if (pickup < new Date()) p.push(b);
            else if (pickup < startOfTomorrow) t.push(b);
            else if (pickup < startOfDayAfterTomorrow) tm.push(b);
            else l.push(b);
        });

        const sort = (a: Booking, b: Booking) =>
            getPickupDateTime(a)!.getTime() - getPickupDateTime(b)!.getTime();

        setToday(t.sort(sort));
        setTomorrow(tm.sort(sort));
        setLater(l.sort(sort));
        setPast(p);
    };

    const getStatus = (b: Booking) =>
        getPickupDateTime(b)?.getTime()! >= Date.now()
            ? "Upcoming"
            : "Completed";

    const renderCard = (item: Booking) => {
        const status = getStatus(item);

        return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() =>
                    navigation.navigate("BookingDetails", { booking: item })
                }
            >
                <View
                    style={[
                        styles.accentBar,
                        status === "Upcoming"
                            ? styles.accentUpcoming
                            : styles.accentPast,
                    ]}
                />

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.bookingId}>#{item.id}</Text>

                        <View
                            style={[
                                styles.statusBadge,
                                status === "Upcoming"
                                    ? styles.statusUpcoming
                                    : styles.statusPast,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    status === "Upcoming"
                                        ? styles.statusTextUpcoming
                                        : styles.statusTextPast,
                                ]}
                            >
                                {status}
                            </Text>
                        </View>
                    </View>

                    {/* Pickup Address */}
                    <Text style={styles.pickupAddress} numberOfLines={1}>
                        📍 {item.pickupLocation?.address || "Unknown location"}
                    </Text>

                    <View style={styles.divider} />

                    {/* Dates */}
                    <View style={styles.row}>
                        <View style={styles.dateChip}>
                            <Text style={styles.chipLabel}>Pickup</Text>
                            <Text style={styles.chipValue}>
                                {item.pickupDate} {item.pickupTime}
                            </Text>
                        </View>

                        <View style={styles.dateChip}>
                            <Text style={styles.chipLabel}>Drop</Text>
                            <Text style={styles.chipValue}>{item.dropDate}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSection = (title: string, data: Booking[]) =>
        data.length > 0 && (
            <>
                <Text style={styles.subTitle}>
                    {title} ({data.length})
                </Text>
                {data.map(renderCard)}
            </>
        );

    return (
        <ScrollView style={{ backgroundColor: "#F6F7F9" }}>
            <View style={styles.container}>
                <Text style={styles.title}>Your Bookings</Text>

                {renderSection("Today", today)}
                {renderSection("Tomorrow", tomorrow)}
                {renderSection("Later", later)}

                <Text style={styles.subTitle}>Past Bookings</Text>
                {past.length === 0 ? (
                    <Text style={styles.noBookings}>No past bookings</Text>
                ) : (
                    past.map(renderCard)
                )}
            </View>
        </ScrollView>
    );
};

export default Bookings;


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#0A8F8F",
        marginBottom: 12,
    },

    subTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 10,
        color: "#222",
    },

    noBookings: {
        textAlign: "center",
        marginTop: 30,
        color: "#777",
        fontSize: 16,
    },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        position: "relative",
    },

    accentBar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
    },

    accentUpcoming: {
        backgroundColor: "#0A8F8F",
    },

    accentPast: {
        backgroundColor: "#CCC",
    },

    cardContent: {
        paddingLeft: 10,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    bookingId: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusUpcoming: {
        backgroundColor: "#E0F7F7",
    },

    statusPast: {
        backgroundColor: "#EEE",
    },

    statusText: {
        fontSize: 13,
        fontWeight: "700",
    },

    statusTextUpcoming: {
        color: "#0A8F8F",
    },

    statusTextPast: {
        color: "#666",
    },

    pickupAddress: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#111",
    },

    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    dateChip: {
        width: "48%",
        backgroundColor: "#F4F6F8",
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    chipLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#777",
    },

    chipValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#222",
        marginTop: 2,
    },
});
