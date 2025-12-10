import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Book from "../screens/dashboard/Book";
import Bookings from "../screens/dashboard/Bookings";

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Book" component={Book} />
            <Tab.Screen name="Bookings" component={Bookings} />
        </Tab.Navigator>
    );
}
