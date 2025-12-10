import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("DashboardTabs")
        }, 1000)

        return () => clearTimeout(timer)
    }, [navigation])

    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <Text style={styles.logoText}>AVIS</Text>
            </View>

            <Text style={styles.subtitle}>Self-Drive Car Rentals</Text>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A8F8F",
        justifyContent: "center",
        alignItems: "center",
    },

    logoBox: {
        padding: 20,
        borderRadius: 100,
        backgroundColor: "white",
        marginBottom: 12,
    },

    logoText: {
        fontSize: 26,
        fontWeight: "800",
        color: "#0A8F8F",
        letterSpacing: 1.5,
    },

    subtitle: {
        fontSize: 14,
        color: "#E8F7F7",
        marginTop: 4,
    },
})
