import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getItem } from "../../storage/mmkv";
import { showUpcomingBookingReminder, cleanupOldReminders } from "../../services/bookingReminder";
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
    const [upcoming, setUpcoming] = useState<Booking[]>([]);
    const [past, setPast] = useState<Booking[]>([]);

    // This runs every time the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            console.log("Bookings screen focused - showing notification");
            cleanupOldReminders();

            // Small delay to ensure smooth transition
            setTimeout(() => {
                showUpcomingBookingReminder();
            }, 300);

            return () => {
                // Cleanup function (optional)
            };
        }, [])
    );

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        const json = getItem("bookings");
        if (!json) return;

        const allBookings: Booking[] = JSON.parse(json);
        const now = Date.now();

        const upcomingList: Booking[] = [];
        const pastList: Booking[] = [];

        allBookings.forEach((b) => {
            if (!b.pickupDate || !b.pickupTime) {
                pastList.push(b);
                return;
            }

            try {
                const [hours, minutes] = b.pickupTime.split(':').map(Number);

                const pickupDateTime = new Date(b.pickupDate);

                pickupDateTime.setHours(hours, minutes, 0, 0);

                if (isNaN(pickupDateTime.getTime())) {
                    pastList.push(b);
                    return;
                }

                if (pickupDateTime.getTime() >= now) {
                    upcomingList.push(b);
                } else {
                    pastList.push(b);
                }
            } catch (error) {
                console.log(error);

                pastList.push(b);
            }
        });

        upcomingList.sort((a, b) => {
            const [aHours, aMinutes] = a.pickupTime.split(':').map(Number);
            const [bHours, bMinutes] = b.pickupTime.split(':').map(Number);

            const aTime = new Date(a.pickupDate);
            aTime.setHours(aHours, aMinutes, 0, 0);

            const bTime = new Date(b.pickupDate);
            bTime.setHours(bHours, bMinutes, 0, 0);

            return aTime.getTime() - bTime.getTime();
        });

        setUpcoming(upcomingList);
        setPast(pastList);
    };

    const renderCard = (item: Booking) => (
        <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
                navigation.navigate("BookingDetails", { booking: item })
            }
        >
            <Text style={styles.bookingId}>#{item.id}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Pickup: </Text>
                <Text style={styles.value}>
                    {item.pickupLocation?.address
                        ? item.pickupLocation.address.length > 10
                            ? item.pickupLocation.address.slice(0, 10) + "..."
                            : item.pickupLocation.address
                        : "Unknown location"}
                </Text>
            </View>

            <View style={styles.row}>
                <View style={styles.sectionHalf}>
                    <Text style={styles.label}>Pickup Date</Text>
                    <Text style={styles.value}>
                        {item.pickupDate} {item.pickupTime}
                    </Text>
                </View>

                <View style={styles.sectionHalf}>
                    <Text style={styles.label}>Drop Date</Text>
                    <Text style={styles.value}>{item.dropDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#F6F7F9" }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Your Bookings</Text>

                <Text style={styles.subTitle}>Upcoming Bookings</Text>
                {upcoming.length === 0 && (
                    <Text style={styles.noBookings}>No upcoming bookings</Text>
                )}
                {upcoming.map(renderCard)}

                <Text style={styles.subTitle}>Past Bookings</Text>
                {past.length === 0 && (
                    <Text style={styles.noBookings}>No past bookings</Text>
                )}
                {past.map(renderCard)}
            </View>
        </ScrollView>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        paddingVertical: 8,
        color: "#0A8F8F",
    },

    noBookings: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#666",
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
        gap: 14,
    },

    bookingId: {
        fontSize: 18,
        fontWeight: "700",
        color: "#444",
    },

    bookingIdValue: {
        color: "#0A8F8F",
        fontWeight: "700",
    },

    section: {
        gap: 4,
        flexDirection: "row",
    },

    sectionHalf: {
        width: "48%",
        gap: 4,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    label: {
        fontSize: 14,
        color: "#777",
        fontWeight: "600",
    },

    value: {
        fontSize: 15,
        color: "#222",
        fontWeight: "500",
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "700",
        paddingVertical: 8,
    }
});