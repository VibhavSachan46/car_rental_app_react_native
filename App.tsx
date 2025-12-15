import React, { useEffect } from 'react'
import SplashScreen from './src/screens/SplashScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DashboardTabs from './src/navigation/DashboardTabs'
import Toast from 'react-native-toast-message'
import { toastConfig } from './src/components/notification/toastConfig'
import Dates from './src/screens/TripDetails'
import { Provider } from 'react-redux'
import store from './src/store/store'
import BookingDetails from './src/screens/BookingDetails'
import Review from './src/screens/Review'
import { showUpcomingBookingReminder, cleanupOldReminders } from './src/services/bookingReminder'
import { AppState, AppStateStatus } from 'react-native'

const Stack = createNativeStackNavigator()

const App = () => {

  useEffect(() => {

    console.log("App started");

    cleanupOldReminders();

    const timer = setTimeout(() => {
      showUpcomingBookingReminder();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    cleanupOldReminders();
    showUpcomingBookingReminder();

    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          showUpcomingBookingReminder();
        }
      }
    );

    return () => subscription.remove();
  }, []);



  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="DashboardTabs" component={DashboardTabs} />
          <Stack.Screen name="Dates" component={Dates} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="Review" component={Review} />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </Provider>
  )
}

export default App