import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking, setPricing } from "../store/slices/bookingDetails";
import Toast from "react-native-toast-message";
import { setItem, getItem } from "../storage/mmkv";
import { CAR_CATEGORIES } from "../constants/carCategories";

const Review = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const {
        pickupLocation,
        dropLocation,
        pickupDateTime,
        dropDateTime,
        userDetails,
        carDetails,
    } = useSelector((state: any) => state.booking);

    const selectedCar = CAR_CATEGORIES.find(
        (c) => c.id === carDetails.carId
    );

    const pickupDT = new Date(pickupDateTime);
    const dropDT = new Date(dropDateTime);

    const rentalDays = useMemo(() => {
        const diffMs = dropDT.getTime() - pickupDT.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }, [pickupDateTime, dropDateTime]);

    const totalAmount = selectedCar
        ? rentalDays * selectedCar.pricePerDay
        : 0;


    const handleConfirm = () => {

        const bookingObject = {
            id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

            car: {
                id: selectedCar?.id,
                name: selectedCar?.name,
                pricePerDay: selectedCar?.pricePerDay,
            },

            pickupLocation,
            dropLocation,

            pickupDateTime,
            dropDateTime,

            rentalDays,
            totalAmount,

            user: {
                ...userDetails,
            },

            status: "UPCOMING",
            createdAt: Date.now(),
        };

        console.log("booking", bookingObject);

        const existing = getItem("bookings");
        const bookings = existing ? JSON.parse(existing) : [];

        bookings.push(bookingObject);
        setItem("bookings", JSON.stringify(bookings));

        dispatch(setPricing({ rentalDays, totalAmount }));
        dispatch(resetBooking());

        Toast.show({
            type: "success",
            text1: "Booking Confirmed 🎉",
            text2: "Your self-drive car is booked",
        });

        navigation.navigate("DashboardTabs", { screen: "Bookings" });
    };

    return (
        <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Review Booking</Text>

                {/* Car */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Car Selected</Text>
                    <Text style={styles.bigText}>{selectedCar?.name}</Text>
                    <Text style={styles.muted}>
                        ₹{selectedCar?.pricePerDay} / day
                    </Text>
                </View>

                {/* Pickup */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Pickup</Text>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{pickupLocation?.address}</Text>

                    <Text style={styles.label}>Date & Time</Text>
                    <Text style={styles.value}>
                        {pickupDT.toLocaleString()}
                    </Text>
                </View>

                {/* Drop */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Drop</Text>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{dropLocation?.address}</Text>

                    <Text style={styles.label}>Date & Time</Text>
                    <Text style={styles.value}>
                        {dropDT.toLocaleString()}
                    </Text>
                </View>

                {/* User */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Your Details</Text>

                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{userDetails.name}</Text>

                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{userDetails.phone}</Text>

                    {userDetails.email ? (
                        <>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{userDetails.email}</Text>
                        </>
                    ) : null}
                </View>

                {/* Pricing */}
                <View style={[styles.card, styles.priceCard]}>
                    <Text style={styles.sectionTitle}>Price Summary</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Duration</Text>
                        <Text style={styles.value}>
                            {rentalDays} day{rentalDays > 1 ? "s" : ""}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Rate</Text>
                        <Text style={styles.value}>
                            ₹{selectedCar?.pricePerDay} / day
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{totalAmount}</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.submitText}>Confirm Booking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Review;



const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#F6F7F9",
    },

    container: {
        padding: 16,
        gap: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#0A8F8F",
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        gap: 8,
    },

    priceCard: {
        backgroundColor: "#F0FBFB",
        borderWidth: 1,
        borderColor: "#CDEEEE",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },

    label: {
        fontSize: 14,
        color: "#777",
        fontWeight: "600",
    },

    value: {
        fontSize: 15,
        color: "#222",
    },

    bigText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0A8F8F",
    },

    muted: {
        fontSize: 14,
        color: "#666",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    divider: {
        height: 1,
        backgroundColor: "#DDD",
        marginVertical: 10,
    },

    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
    },

    totalValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#0A8F8F",
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },

    editBtn: {
        flex: 1,
        backgroundColor: "#E0E0E0",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    editText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
    },

    submitBtn: {
        flex: 1,
        backgroundColor: "#0A8F8F",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    submitText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
});
