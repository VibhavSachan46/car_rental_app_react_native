import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import MapSection from '../../components/bookfragment/MapSection';
import { useDispatch } from 'react-redux';
import { setPickupLocation, setDropLocation } from '../../store/slices/bookingDetails';
import Filters from '../../components/bookfragment/Filters';
import { setItem, getItem } from '../../storage/mmkv';
import Slider from "@react-native-community/slider";


const Book = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const [pickup, setPickup] = useState<any>(null);
    const [drop, setDrop] = useState<any>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>("")
    const [value, setValue] = useState<number>(5);


    function handleContinue() {
        if (!pickup || !drop) {
            Alert.alert("Select pickup and drop locations");
            return;
        }
        setItem("pickup", JSON.stringify(pickup));
        setItem("drop", JSON.stringify(drop));

        console.log("MMKV Pickup:", getItem("pickup"));
        console.log("MMKV Drop:", getItem("drop"));
        navigation.navigate("Dates");
    }

    return (
        <View style={styles.container}>

            <View style={styles.filtercontainer}>

                <Text style={styles.inputView}>
                    Drop Location: {drop ? drop.address : "Select location"}
                </Text>
                <View style={styles.sliderContainer}>

                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={value}
                        minimumTrackTintColor="#0A8F8F"
                        thumbTintColor="#0A8F8F"
                        onValueChange={(val) => setValue(val)}
                    />

                    <Text style={styles.sliderValue}>{value} km</Text>
                </View>

                <Filters
                    setSelectedFilter={setSelectedFilter}
                    selectedFilter={selectedFilter}
                />
            </View>


            <View style={styles.mapSection}>
                <MapSection
                    filterType={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    value={value}
                    onPickupSelected={(value) => {
                        setPickup(value);
                        dispatch(setPickupLocation(value));

                    }}
                    onDropSelected={(value) => {
                        setDrop(value);
                        dispatch(setDropLocation(value));
                    }}
                />

            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Book;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    mapSection: { flex: 1 },

    bottomContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingBottom: 28,
        position: "absolute",
        bottom: 0,
    },
    continueBtn: {
        width: "100%",
        backgroundColor: "#0A8F8F",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        zIndex: 100
    },

    continueText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    },

    filtercontainer: {
        width: "100%",
        position: "absolute",
        top: 20,
        paddingHorizontal: 20,
        zIndex: 20,
    },

    inputView: {
        width: "100%",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 12,
    },

    sliderContainer: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 3,
    },

    sliderLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#444",
    },

    slider: {
        width: "90%",
    },

    sliderValue: {
        textAlign: "center",
        fontWeight: "600",
        marginTop: 4,
        color: "#0A8F8F",
    },



});
