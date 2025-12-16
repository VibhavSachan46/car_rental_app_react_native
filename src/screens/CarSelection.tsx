import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useState } from "react";
import { CAR_CATEGORIES } from "../constants/carCategories";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import { setCarId } from "../store/slices/bookingDetails";

const CarSelection = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const handleContinue = () => {
        console.log("Selected car id", selectedCarId);
        dispatch(setCarId(selectedCarId))

        navigation.navigate("Dates");
    };

    const renderCar = ({ item }: any) => {
        const isSelected = item.id === selectedCarId;

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedCarId(item.id)}
                style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                ]}
            >
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.carImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    <View style={styles.header}>
                        <Text style={styles.carName}>{item.name}</Text>
                        {isSelected && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>SELECTED</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.price}>₹{item.pricePerDay} / day</Text>

                    <Text style={styles.subText}>
                        Fuel excluded · Self drive
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Choose Your Car</Text>
            <Text style={styles.subHeading}>
                Prices shown are per day
            </Text>

            <FlatList
                data={CAR_CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={renderCar}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    disabled={!selectedCarId}
                    onPress={handleContinue}
                    style={[
                        styles.continueBtn,
                        !selectedCarId && { opacity: 0.5 },
                    ]}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CarSelection;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    heading: {
        fontSize: 22,
        fontWeight: "700",
        color: "#0A8F8F",
    },

    subHeading: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
        marginBottom: 16,
    },

    selectedText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#000",
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderColor: "#E0E0E0",
    },

    continueBtn: {
        backgroundColor: "#0A8F8F",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    continueText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    ///////

    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "gray",
        padding: 14,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 4 },
        flexDirection: "row",
    },

    selectedCard: {
        borderWidth: 2,
        borderColor: "#0A8F8F",
    },

    imageContainer: {
        width: 110,        // controls uniform width
        height: 70,
        backgroundColor: "#F2F2F2",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },

    carImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
        backgroundColor: "#F2F2F2",
    },

    infoContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "center",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    badge: {
        backgroundColor: "#E6F4F4",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },

    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#0A8F8F",
    },

    carName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A1A1A",
    },

    price: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: "700",
        color: "#0A8F8F",
    },

    subText: {
        marginTop: 4,
        fontSize: 12,
        color: "#777",
    },

});
