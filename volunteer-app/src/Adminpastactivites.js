import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const AdminPastActivitiesScreen = ({ navigation, route }) => {
  const { orgId } = route.params; // Get orgId from navigation params
  const [pastActivities, setPastActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastActivities = async () => {
      try {
        // Make an API call to fetch past activities for the given organization
        const response = await axios.get(`https://volunteersphere.onrender.com/activities/past/${orgId}`);
        
        if (response.status === 200) {
          if (response.data.length > 0) {
            setPastActivities(response.data); // Store the fetched activities
            setError(null); // Reset any previous error messages
          } else {
            setPastActivities([]);
            setError('No past activities found.');
          }
        } else {
          setError('Unable to fetch past activities. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching past activities:', error);
        setError('Unable to fetch past activities. Please try again later.');
        setPastActivities([]);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchPastActivities(); // Call the function to fetch data when the component mounts
  }, [orgId]); // Dependency array ensures the effect runs when orgId changes

  const handleSeeReview = (activityId) => {
    navigation.navigate('AdminCommentsScreen', { activityId, orgId }); // Navigate to review screen with selected activity
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityContainer}>
      <Text style={styles.activityTitle}>{item.name}</Text>
      <Text style={styles.activityDetails}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => handleSeeReview(item._id)}
      >
        <Text style={styles.reviewButtonText}>See Review</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Activities</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff8c00" /> // Show loading indicator while fetching data
      ) : error ? ( // Check if there's an error
        <View style={styles.noActivitiesContainer}>
          <Text style={styles.noActivitiesText}>{error}</Text> // Show error message
        </View>
      ) : (
        <FlatList
          data={pastActivities} // Pass fetched activities as data to FlatList
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderActivityItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff8c00',
  },
  activityContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  reviewButton: {
    backgroundColor: '#ff8c00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noActivitiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noActivitiesText: {
    fontSize: 16,
    color: '#555',
  },
});

export default AdminPastActivitiesScreen;
