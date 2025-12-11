import React from 'react'
import SplashScreen from './src/screens/SplashScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DashboardTabs from './src/navigation/DashboardTabs'
import Toast from 'react-native-toast-message'
import Dates from './src/screens/Dates'
import { Provider } from 'react-redux'
import store from './src/store/store'
import Details from './src/screens/Details'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
          />

          <Stack.Screen
            name="DashboardTabs"
            component={DashboardTabs}
          />

          <Stack.Screen
            name="Dates"
            component={Dates}
          />

          <Stack.Screen
            name="Details"
            component={Details}
          />

        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </Provider>
  )
}

export default App
