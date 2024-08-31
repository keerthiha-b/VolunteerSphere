import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './src/LandingPage';
import SignUpScreen from './src/SignUpScreen';
import LoginScreen from './src/Login';
import CreateVolunteerOpportunity from './src/CreateVolunteerOpportunity';
import VolunteerOpportunities from './src/VolunteerOpportunities';
import OrgLandingPage from './src/LandingPageOrg';
import StudentLandingPage from './src/StudentLandingPage';
import ProfilePage from './src/ProfilePage';
import SuccessScreen from './src/Success';
import MapScreen from './src/MapScreen'; 
import ActivityDetails from './src/Activitydetails';
import ActivitySignup from './src/Signupactivity';
import UserActivitiesScreen from './src/Commentsbystudents';
import LeaveComment from './src/leavecomment';  
import AdminCommentsScreen from './src/admincommentpage';
import AdminPastActivitiesScreen from './src/Adminpastactivites';


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
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: true, title: 'Map' }} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetails} options={{ title: 'Activity Details' }} />
        <Stack.Screen name="ActivitySignup" component={ActivitySignup} />
        <Stack.Screen name="UserActivitiesScreen" component={UserActivitiesScreen}/>
        <Stack.Screen name="Leave Comment" component={LeaveComment} />
        <Stack.Screen
          name="AdminPastActivitiesScreen"
          component={AdminPastActivitiesScreen}
          options={{ headerShown: true, title: 'Past Activities' }}
        />
        <Stack.Screen
          name="AdminCommentsScreen"
          component={AdminCommentsScreen}
          options={{ headerShown: true, title: 'Activity Comments' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
