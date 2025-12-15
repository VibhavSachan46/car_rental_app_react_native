import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const toastConfig = {
    info: (props: any) => (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{props.text1}</Text>
                <Text style={styles.message}>{props.text2}</Text>

                {props.props?.pickupLocation && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationLabel}>📍 Pickup:</Text>
                        <Text style={styles.locationText} numberOfLines={2}>
                            {props.props.pickupLocation}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.snoozeButton]}
                    onPress={() => {
                        props.props?.onSnooze?.();
                    }}
                >
                    <Text style={styles.buttonText}>Snooze 15m</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.dismissButton]}
                    onPress={() => {
                        props.props?.onDismiss?.();
                    }}
                >
                    <Text style={styles.buttonText}>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </View>
    ),
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        borderWidth: 4,
        borderColor: '#0A8F8F',
        elevation: 5,
    },
    contentContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0A8F8F',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: '#444',
        fontWeight: '600',
        marginBottom: 8,
    },
    locationContainer: {
        backgroundColor: '#F6F7F9',
        padding: 10,
        borderRadius: 8,
        marginTop: 4,
    },
    locationLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0A8F8F',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    snoozeButton: {
        backgroundColor: '#0A8F8F',
    },
    dismissButton: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});