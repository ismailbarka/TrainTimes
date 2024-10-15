// AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SetInfosScreen from './screens/SetInfosScreen';
import HomePage from './screens/HomePage';
import Availability from './screens/Availability';
import TripDetails from './screens/TripDetails';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SetInfosScreen">
        <Stack.Screen options={{ headerShown: false }}  name="SetInfosScreen" component={SetInfosScreen} />
        <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="AvailabilityScreen" component={Availability} />
        <Stack.Screen options={{ headerShown: false }} name="TripDetails" component={TripDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
