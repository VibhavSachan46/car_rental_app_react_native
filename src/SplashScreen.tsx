import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace("DashboardTabs")
        }, 1000)
    }, [navigation])
    return (
        <View style={styles.container}>
            <Text>SplashScreen</Text>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center"
    }
})