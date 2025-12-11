import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Booking = {
    name: string;
    phone: string;
    email: string;
    pickupDate: string | null;
    dropDate: string | null;
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
    id: number;
};


const Bookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    useEffect(() => {
        async function getBookings() {
            const json = await AsyncStorage.getItem("bookings");

            if (json) {
                const curBookings = JSON.parse(json);
                console.log("All bookings →", curBookings);
                setBookings(curBookings);
            } else {
                console.log("No bookings found");
            }
        }
        getBookings();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Bookings</Text>
                {bookings.map((item) => (
                    <View style={styles.box} key={item.id}>
                        <Text style={styles.heading}>booking id :
                            <Text style={styles.content}> {item.id}</Text>
                        </Text>
                        <Text style={styles.heading}>Pickup Location :
                            <Text style={styles.content}> {item.pickupLocation?.address}</Text>
                        </Text>
                        <Text style={styles.heading}>Drop Location :
                            <Text style={styles.content}> {item.dropLocation?.address}</Text>
                        </Text>
                        <Text style={styles.heading}>Pickup date :
                            <Text style={styles.content}> {item.pickupDate}</Text>
                        </Text>
                        <Text style={styles.heading}>Drop date :
                            <Text style={styles.content}> {item.dropDate}</Text>
                        </Text>
                        <Text style={styles.heading}>Name :
                            <Text style={styles.content}> {item.name}</Text>
                        </Text>
                        <Text style={styles.heading}>email :
                            <Text style={styles.content}> {item.email}</Text>
                        </Text>
                        <Text style={styles.heading}>phone :
                            <Text style={styles.content}> {item.phone}</Text>
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default Bookings

const styles = StyleSheet.create({
    container: {
        gap: 12,
        padding: 16,
    },
    box: {
        borderWidth: 1 / 3,
        borderColor: "black",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    heading: {
        fontWeight: 700
    },
    content: {
        fontWeight: 400
    },
    title: {
        fontWeight: 800,
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 12
    }
})