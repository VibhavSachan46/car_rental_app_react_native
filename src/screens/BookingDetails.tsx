import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { GOOGLE_API } from "@env";

const { width } = Dimensions.get("window");

const BookingDetails = ({ route }: any) => {
    const { booking } = route.params;

    const pickup = booking.pickupLocation;
    const drop = booking.dropLocation;

    const pickupDT = booking.pickupDateTime
        ? new Date(booking.pickupDateTime)
        : null;
    const dropDT = booking.dropDateTime
        ? new Date(booking.dropDateTime)
        : null;

    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const [routeDistance, setRouteDistance] = useState<number | null>(null);

    useEffect(() => {
        if (pickup && drop) fetchRoute();
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
            {/* MAP */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pickup?.latitude || 28.61,
                    longitude: pickup?.longitude || 77.20,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }}
            >
                {pickup && <Marker coordinate={pickup} title="Pickup" />}
                {drop && <Marker coordinate={drop} title="Drop" />}

                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={4}
                        strokeColor="#0A8F8F"
                    />
                )}
            </MapView>

            {/* DETAILS */}
            <ScrollView
                style={styles.details}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Booking Details</Text>

                {/* SUMMARY */}
                <Section title="Summary">
                    <Detail label="Car" value={booking.car?.name || "Car"} />
                    <Detail
                        label="Total Amount"
                        value={`₹${booking.totalAmount || 0}`}
                    />
                    <Detail
                        label="Duration"
                        value={`${booking.rentalDays || 0} day(s)`}
                    />
                </Section>

                {/* TRIP */}
                <Section title="Trip Information">
                    <Detail
                        label="Distance"
                        value={
                            routeDistance
                                ? `${routeDistance.toFixed(2)} km`
                                : "Calculating..."
                        }
                    />

                    <Detail
                        label="Pickup"
                        value={
                            pickupDT ? pickupDT.toLocaleString() : "-"
                        }
                    />

                    <Detail
                        label="Drop"
                        value={
                            dropDT ? dropDT.toLocaleString() : "-"
                        }
                    />
                </Section>

                {/* LOCATIONS */}
                <Section title="Locations">
                    <Detail
                        label="Pickup Location"
                        value={pickup?.address || "Unknown"}
                    />
                    <Detail
                        label="Drop Location"
                        value={drop?.address || "Unknown"}
                    />
                </Section>

                {/* USER */}
                <Section title="Passenger Details">
                    <Detail
                        label="Name"
                        value={booking.user?.name || "-"}
                    />
                    <Detail
                        label="Phone"
                        value={booking.user?.phone || "-"}
                    />
                    {booking.user?.email ? (
                        <Detail
                            label="Email"
                            value={booking.user.email}
                        />
                    ) : null}
                </Section>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

/* -------------------- HELPERS -------------------- */

const decodePolyline = (encoded: string) => {
    let poly: any[] = [];
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

/* -------------------- UI HELPERS -------------------- */

const Section = ({ title, children }: any) => (
    <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const Detail = ({ label, value }: any) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

/* -------------------- STYLES -------------------- */

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
        borderRadius: 16,
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

    detailRow: {
        marginBottom: 12,
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
});

export default BookingDetails;
