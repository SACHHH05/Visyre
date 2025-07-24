import 'react-native-reanimated'; // Must be first!
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HO'; // 
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'BebasNeue-Regular': require('./assets/fonts/BebasNeue-Regular.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
