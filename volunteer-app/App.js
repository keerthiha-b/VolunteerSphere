import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './src/LandingPage';
import SignUpScreen from './src/SignUpScreen';
import LoginScreen from './src/Login'; // Ensure this is named correctly as LoginScreen
import CreateVolunteerOpportunity from './src/CreateVolunteerOpportunity';
import VolunteerOpportunities from './src/VolunteerOpportunities';
import OrgLandingPage from './src/LandingPageOrg';
import StudentLandingPage from './src/StudentLandingPage'; // Ensure correct path and naming
import ProfilePage from './src/ProfilePage';
import SuccessScreen from './src/Success';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrgLandingPage" component={OrgLandingPage} options={{ headerShown: true, title: 'Organization Dashboard' }} /> 
        <Stack.Screen name="StudentLandingPage" component={StudentLandingPage} options={{ headerShown: true, title: 'Student Dashboard' }} /> 
        <Stack.Screen name="CreateVolunteerOpportunity" component={CreateVolunteerOpportunity} options={{ headerShown: true, title: 'Create Volunteer Opportunity' }} />
        <Stack.Screen name="VolunteerOpportunities" component={VolunteerOpportunities} options={{ headerShown: true, title: 'Volunteer Opportunities' }} />
        <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
