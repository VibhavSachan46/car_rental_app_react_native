import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Book from "../screens/dashboard/Book";
import Bookings from "../screens/dashboard/Bookings";

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarIcon: () => null,

                // ⭐ Force React Navigation to avoid multi-row layout
                tabBarLabelPosition: "beside-icon",

                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },

                tabBarLabelStyle: {
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 0,
                    marginTop: 0,
                },

                tabBarStyle: {
                    height: 60,
                    paddingBottom: 0,
                    paddingTop: 0,
                },

                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
            }}

        >
            <Tab.Screen name="Book" component={Book} />
            <Tab.Screen name="Bookings" component={Bookings} />
        </Tab.Navigator>
    );
}
