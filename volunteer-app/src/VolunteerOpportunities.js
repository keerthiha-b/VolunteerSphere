import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import EachPosting from './EachPosting';  
import ApprovalActivitiesList from './ApprovalActivitiesList'; 
import { getValueFor } from './utils/secureStoreUtil';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Create the Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [pastOpportunities, setPastOpportunities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userType = await getValueFor('userType');
        const organizationId = await getValueFor('userId');
        
        let response;
        if (userType === 'org') {
          response = await axios.get(`https://volunteersphere.onrender.com/activities/${organizationId}`);
        } else {
          response = await axios.get('https://volunteersphere.onrender.com/activities');
        }

        const allActivities = response.data;
        setOpportunities(allActivities.filter(activity => new Date(activity.date) >= new Date())); // Upcoming
        setPastOpportunities(allActivities.filter(activity => new Date(activity.date) < new Date())); // Past
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  // Upcoming Activities Component
  const UpcomingActivities = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => <EachPosting opportunity={item} />}
      />
    </SafeAreaView>
  );

  // Past Activities Component
  const PastActivities = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pastOpportunities}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => <ApprovalActivitiesList opportunity={item} />}
      />
    </SafeAreaView>
  );

  return (
    <Tab.Navigator
      initialRouteName="Upcoming"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#ffffff' },
        tabBarIndicatorStyle: { backgroundColor: '#e91e63' },
      }}
    >
      <Tab.Screen
        name="Upcoming"
        component={UpcomingActivities}
        options={{ tabBarLabel: 'Upcoming Activities' }}
      />
      <Tab.Screen
        name="Past"
        component={PastActivities}
        options={{ tabBarLabel: 'Past Activities' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',  
  },
});

export default VolunteerOpportunities;
