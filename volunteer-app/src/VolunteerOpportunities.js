import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import axios from 'axios';
import EachPosting from './EachPosting';
import ApprovalActivitiesList from './ApprovalActivitiesList';
import { getValueFor } from './utils/secureStoreUtil';

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [pastOpportunities, setPastOpportunities] = useState([]);
  const [selectedTab, setSelectedTab] = useState('upcoming'); // Track selected tab

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

  // Callback to remove deleted activity from upcoming list
  const removeFromUpcoming = (activityId) => {
    setOpportunities(prevOpportunities => prevOpportunities.filter(activity => activity._id !== activityId));
  };

  // Callback to remove deleted activity from past list
  const removeFromPast = (activityId) => {
    setPastOpportunities(prevPastOpportunities => prevPastOpportunities.filter(activity => activity._id !== activityId));
  };

  // Render Upcoming Activities
  const renderUpcomingActivities = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <EachPosting
            opportunity={item}
            deleteActivityCallback={removeFromUpcoming}
          />
        )}
      />
    </SafeAreaView>
  );

  // Render Past Activities
  const renderPastActivities = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pastOpportunities}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <ApprovalActivitiesList
            opportunity={item}
            deleteActivityCallback={removeFromPast}
          />
        )}
      />
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {/* Custom Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            Upcoming Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
            Past Activities
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Content Based on Selected Tab */}
      {selectedTab === 'upcoming' ? renderUpcomingActivities() : renderPastActivities()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63', // Active tab underline color
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#e91e63', // Active tab text color
  },
});

export default VolunteerOpportunities;
