import { FlatList, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React from "react";

const NearbyList = ({ places, onSelect }: any) => {
    if (!places || places.length === 0) return null;

    return (
        <View style={styles.listContainer}>
            <FlatList
                data={places}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
                        <Text style={styles.name}>{item.name}</Text>
                        {item.vicinity && <Text style={styles.address}>{item.vicinity}</Text>}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default NearbyList;

const styles = StyleSheet.create({
    listContainer: {
        position: "absolute",
        top: 160, // right below search+filter
        left: 20,
        right: 20,
        maxHeight: 300,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
        zIndex: 99,

    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    address: {
        color: "#555",
        marginTop: 2,
    },
});
