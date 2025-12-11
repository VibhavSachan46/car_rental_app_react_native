import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from "../store/slices/bookingDetails"
import { resetBooking } from "../store/slices/bookingDetails"
import AsyncStorage from "@react-native-async-storage/async-storage";


const Details = ({ navigation }: any) => {

    const pickupDate = useSelector((state: any) => state.booking.pickupDate);
    const dropDate = useSelector((state: any) => state.booking.dropDate);
    const pickupLocation = useSelector((state: any) => state.booking.pickupLocation);
    const dropLocation = useSelector((state: any) => state.booking.dropLocation);

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    const dispatch = useDispatch()

    async function addToAsycStorage() {

        const bookingObject = {
            name,
            phone,
            email,
            pickupDate,
            dropDate,
            pickupLocation,
            dropLocation,
            id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        };
        const existing = await AsyncStorage.getItem("bookings");

        let bookings = existing ? JSON.parse(existing) : [];

        bookings.push(bookingObject);

        await AsyncStorage.setItem("bookings", JSON.stringify(bookings));

        console.log("Booking saved:", bookingObject);
    }

    async function handleSubmit() {

        dispatch(setUserDetails({ name, phone, email }));

        await addToAsycStorage()

        dispatch(resetBooking());

        navigation.navigate("DashboardTabs", {
            screen: "Bookings",
        });

    }
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View >
                    <Text>Name</Text>
                    <TextInput
                        placeholder='Enter name'
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.box}>
                    <Text>phone</Text>
                    <TextInput
                        placeholder='Enter phone'
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <View style={styles.box}>
                    <Text>email</Text>
                    <TextInput
                        placeholder='Enter email'
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
                    <Text style={styles.continueText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Details

const styles = StyleSheet.create({
    container: {
        height: "100%",
        marginTop: 40,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 20,
        marginBottom: 40,
        alignItems: "center",
        justifyContent: "space-between"
    },
    box: {
        width: "100%",
        gap: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    bottomContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingBottom: 28,
    },
    continueBtn: {
        width: "100%",
        backgroundColor: "#0A8F8F",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    continueText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
})