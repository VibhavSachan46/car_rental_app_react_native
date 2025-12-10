import React from 'react'
import SplashScreen from './src/SplashScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import DashboardTabs from './src/navigation/DashboardTabs'
import Toast from 'react-native-toast-message'


const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <>
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

        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </>
  )
}

export default App
