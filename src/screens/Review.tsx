import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../store/slices/bookingDetails";
import Toast from "react-native-toast-message";
import { setItem, getItem } from "../storage/mmkv";

const Review = ({ navigation }: any) => {
    const {
        pickupDate,
        dropDate,
        pickupLocation,
        dropLocation,
        pickupTime,
        userDetails
    } = useSelector((state: any) => state.booking);

    const dispatch = useDispatch();

    function addToMMKV() {
        const bookingObject = {
            ...userDetails,
            pickupDate,
            pickupTime,
            dropDate,
            pickupLocation,
            dropLocation,
            id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };

        const existing = getItem("bookings");
        let bookings = existing ? JSON.parse(existing) : [];

        bookings.push(bookingObject);
        setItem("bookings", JSON.stringify(bookings));
    }

    function handleConfirm() {
        addToMMKV();
        dispatch(resetBooking());

        Toast.show({
            type: "success",
            text1: "Booking Confirmed",
            text2: "Your booking has been saved!",
        });

        navigation.navigate("DashboardTabs", { screen: "Bookings" });
    }

    function handleEdit() {
        navigation.goBack();
    }

    return (
        <ScrollView style={{ backgroundColor: "#F6F7F9" }} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Review Booking</Text>

                {/* Pickup */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Pickup Details</Text>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{pickupLocation?.address}</Text>

                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{pickupDate}</Text>

                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.value}>{pickupTime}</Text>
                </View>

                {/* Drop */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Drop Details</Text>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{dropLocation?.address}</Text>

                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{dropDate}</Text>
                </View>

                {/* User */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Your Details</Text>

                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{userDetails.name}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{userDetails.email}</Text>

                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{userDetails.phone}</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleConfirm}>
                        <Text style={styles.submitText}>Confirm Booking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Review;

const styles = StyleSheet.create({
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
        gap: 10,
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
        marginBottom: 8,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
        gap: 12,
    },

    editBtn: {
        flex: 1,
        backgroundColor: "#ccc",
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
