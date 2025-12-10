import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import MapSection from '../../components/MapSection';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../store/slices/bookingDetails';

const Book = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [localLocation, setLocalLocation] = useState("");

    function handleContinue() {
        if (!localLocation) {
            Alert.alert("Please select a location on the map");
            return;
        }
        navigation.navigate("Dates");
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapSection}>
                <MapSection
                    setLocation={(value) => {
                        setLocalLocation(value);
                        dispatch(setLocation(value));
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mapSection: {
        flex: 1,
    },
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
});
