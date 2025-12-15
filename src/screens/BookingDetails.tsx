import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { GOOGLE_API } from "@env";

const BookingDetails = ({ route }: any) => {
    const { booking } = route.params;

    const pickup = booking.pickupLocation;
    const drop = booking.dropLocation;

    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const [routeDistance, setRouteDistance] = useState<number | null>(null);

    useEffect(() => {
        fetchRoute();
    }, []);

    const fetchRoute = async () => {
        try {
            const origin = `${pickup.latitude},${pickup.longitude}`;
            const destination = `${drop.latitude},${drop.longitude}`;

            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.routes?.length) {
                const route = data.routes[0];

                const meters = route.legs[0].distance.value;
                setRouteDistance(meters / 1000);

                const decodedPoints = decodePolyline(
                    route.overview_polyline.points
                );
                setRouteCoords(decodedPoints);
            }
        } catch (error) {
            console.log("Route fetch error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pickup.latitude,
                    longitude: pickup.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }}
            >
                <Marker coordinate={pickup} title="Pickup" />
                <Marker coordinate={drop} title="Drop" />

                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={4}
                        strokeColor="#0A8F8F"
                    />
                )}
            </MapView>

            <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Booking Details</Text>

                <Section title="Trip Info">
                    <Detail
                        label="Distance"
                        value={
                            routeDistance
                                ? `${routeDistance.toFixed(2)} km`
                                : "Calculating..."
                        }
                    />
                </Section>

                <Section title="Pickup Details">
                    <Detail label="Location" value={pickup.address} />
                    <Detail label="Date" value={booking.pickupDate} />
                    <Detail label="Time">
                        <View style={styles.timeChip}>
                            <Text style={styles.timeText}>
                                {booking.pickupTime}
                            </Text>
                        </View>
                    </Detail>
                </Section>

                <Section title="Drop Details">
                    <Detail label="Location" value={drop.address} />
                    <Detail label="Date" value={booking.dropDate} />
                </Section>

                <Section title="Passenger Details">
                    <Detail label="Name" value={booking.name} />
                    <Detail label="Email" value={booking.email} />
                    <Detail label="Phone" value={booking.phone} />
                </Section>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

/* ---------------- HELPERS ---------------- */

const decodePolyline = (encoded: string) => {
    let poly = [];
    let index = 0,
        lat = 0,
        lng = 0;

    while (index < encoded.length) {
        let b,
            shift = 0,
            result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        poly.push({
            latitude: lat / 1e5,
            longitude: lng / 1e5,
        });
    }
    return poly;
};

/* ---------------- UI COMPONENTS ---------------- */

const Section = ({ title, children }: any) => (
    <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const Detail = ({ label, value, children }: any) => (
    <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
        {children}
    </View>
);

export default BookingDetails;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7F9",
    },
    map: {
        width: "100%",
        height: 280,
    },
    details: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 16,
        color: "#0A8F8F",
    },
    sectionBox: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 12,
        color: "#333",
    },
    label: {
        fontSize: 13,
        color: "#777",
        fontWeight: "600",
    },
    value: {
        fontSize: 16,
        color: "#222",
        fontWeight: "500",
        marginTop: 2,
    },
    timeChip: {
        backgroundColor: "#0A8F8F22",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginTop: 4,
    },
    timeText: {
        color: "#0A8F8F",
        fontSize: 15,
        fontWeight: "700",
    },
});
