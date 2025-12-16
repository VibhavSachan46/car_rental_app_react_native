import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PanResponder,
    Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapSection from "../../components/bookfragment/MapSection";
import { useDispatch } from "react-redux";
import {
    setPickupLocation,
    setDropLocation,
} from "../../store/slices/bookingDetails";
import Filters from "../../components/bookfragment/Filters";
import { setItem, getItem } from "../../storage/mmkv";


const SimpleSlider = ({
    value,
    min = 1,
    max = 10,
    onChange,
}: {
    value: number;
    min?: number;
    max?: number;
    onChange: (v: number) => void;
}) => {
    const TRACK_WIDTH = 280;
    const pan = useRef(new Animated.Value(0)).current;
    const lastX = useRef(0);

    useEffect(() => {
        const percent = (value - min) / (max - min);
        const x = percent * TRACK_WIDTH;
        pan.setValue(x);
        lastX.current = x;
    }, [value]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let newX = lastX.current + gesture.dx;
                newX = Math.max(0, Math.min(TRACK_WIDTH, newX));

                const newValue = Math.round(
                    min + (newX / TRACK_WIDTH) * (max - min)
                );

                pan.setValue(newX);
                onChange(newValue);
            },
            onPanResponderRelease: () => {
                lastX.current = (value - min) / (max - min) * TRACK_WIDTH;
            },
        })
    ).current;

    return (
        <View style={{ width: TRACK_WIDTH }}>
            <View style={styles.sliderTrack} />
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.sliderThumb,
                    {
                        transform: [{ translateX: pan }],
                    },
                ]}
            />
        </View>
    );
};


const Book = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const [pickup, setPickup] = useState<any>(null);
    const [drop, setDrop] = useState<any>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>("");
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
                    <SimpleSlider
                        min={1}
                        max={10}
                        value={value}
                        onChange={setValue}
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
                    onPickupSelected={(val) => {
                        setPickup(val);
                        dispatch(setPickupLocation(val));
                    }}
                    onDropSelected={(val) => {
                        setDrop(val);
                        dispatch(setDropLocation(val));
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
    },

    continueText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
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
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },

    sliderTrack: {
        height: 4,
        backgroundColor: "#ddd",
        borderRadius: 2,
    },

    sliderThumb: {
        position: "absolute",
        top: -8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#0A8F8F",
    },

    sliderValue: {
        marginLeft: 12,
        fontWeight: "600",
        color: "#0A8F8F",
        width: 50,
        textAlign: "right",
    },
});
