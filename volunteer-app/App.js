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
import LeaderboardPage from './src/LeaderboardPage';
import SignUps from './src/showSignups';
import PastActivities from './src/showPastsignups'
import CertificatesScreen from './src/CertificateList';
import CertificateDetailScreen from './src/certificatedetail';
import UserActivitiesScreen from './src/Commentsbystudents';
import LeaveComment from './src/leavecomment';  
import MissionsPage from './src/MissionsPage';
import AdminComment from'./src/AdminCommentstab';
import Commentdetail from './src/commentsview';
import AvatarSelection from './src/AvatarSelection';


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
        <Stack.Screen name="AvatarSelection" component={AvatarSelection} options={{ headerShown: true, title: 'Customize your avatar' }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: true, title: 'Map' }} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetails} options={{ title: 'Activity Details' }} />
        <Stack.Screen name="ActivitySignup" component={ActivitySignup} />
        <Stack.Screen name="Leaderboard" component={LeaderboardPage} options={{ headerShown: true, title: 'Leaderboard Page' }} />
        <Stack.Screen name="Signups" component={SignUps} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="PastActivities" component={PastActivities} />
        <Stack.Screen name="CertificatesScreen" component={CertificatesScreen} options={{ title: 'Your Certificates' }} />
        <Stack.Screen name="CertificateDetailScreen" component={CertificateDetailScreen} options={{ title: 'Your Certificates' }} />

        <Stack.Screen name="UserActivitiesScreen" component={UserActivitiesScreen}/>
        <Stack.Screen name="Leave Comment" component={LeaveComment} />
        <Stack.Screen name="MissionsPage" component={MissionsPage} options={{ headerShown: true, title: 'Missions' }} /> 
        <Stack.Screen name="Comments" component={AdminComment} />
        <Stack.Screen name="Commentdetail" component={Commentdetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
