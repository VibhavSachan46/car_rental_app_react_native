/* eslint-disable react-native/no-inline-styles */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FILTER_TABS } from '../../constants/filters'

const Filters = ({ setSelectedFilter, selectedFilter }: any) => {

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabscontainer}>
                {
                    FILTER_TABS.map((item) => (
                        <TouchableOpacity
                            key={item.type}
                            style={[
                                styles.filterIcon,
                                selectedFilter === item.type && styles.activeFilter
                            ]}
                            onPress={() => setSelectedFilter(item.type)}
                        >
                            <Text style={{
                                color: selectedFilter === item.type ? "#fff" : "#000",
                                fontWeight: "600"
                            }}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default Filters

const styles = StyleSheet.create({
    filterTabscontainer: {
        width: "90%",
        marginTop: 24,
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    filterIcon: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    activeFilter: {
        backgroundColor: "#0A8F8F",
        borderColor: "#0A8F8F",
    },
})
