import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './src/LandingPage';
import SignUpScreen from './src/SignUpScreen';
import LoginPage from './src/Login';
import CreateVolunteerOpportunity from './src/CreateVolunteerOpportunity'; // Import the new component
// Import other screens here as needed

const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="CreateVolunteerOpportunity" component={CreateVolunteerOpportunity} options={{ headerShown: true, title: 'Create Volunteer Opportunity' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;