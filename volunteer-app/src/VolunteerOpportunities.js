import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';
import EachPosting from './EachPosting';  
import ApprovalActivitiesList from './ApprovalActivitiesList'; 
import { getValueFor } from './utils/secureStoreUtil';

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [pastOpportunities, setPastOpportunities] = useState([]);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [error, setError] = useState(null);

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
        setError('Error fetching activities');
      }
    };

    fetchActivities();
  }, []);

  const renderUpcomingActivities = () => (
    <SafeAreaView style={styles.container}>
      {opportunities.length === 0 ? (
        <Text>No upcoming opportunities found.</Text> // Display message if no upcoming opportunities
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => <EachPosting opportunity={item} />}
        />
      )}
    </SafeAreaView>
  );

  const renderPastActivities = () => (
    <SafeAreaView style={styles.container}>
      {pastOpportunities.length === 0 ? (
        <Text>No past opportunities found.</Text> // Display message if no past opportunities
      ) : (
        <FlatList
          data={pastOpportunities}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => <ApprovalActivitiesList opportunity={item} />}
        />
      )}
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {/* Tab bar */}
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

      {/* Render content based on selected tab */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : selectedTab === 'upcoming' ? (
        renderUpcomingActivities()
      ) : (
        renderPastActivities()
      )}
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
    borderBottomColor: 'black',
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default VolunteerOpportunities;
