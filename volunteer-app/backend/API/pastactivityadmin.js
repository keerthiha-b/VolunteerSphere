import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Import the images
import healthImage from './images/Health.jpg';
import environmentImage from './images/cleaning.jpg';
import educationImage from './images/education.jpg';
import communityServiceImage from './images/community.jpg';
import animalWelfareImage from './images/animalwelfare.png';

// Map categories to corresponding images
const categoryImages = {
  Health: healthImage,
  Environment: environmentImage,
  Education: educationImage,
  'Community Service': communityServiceImage,
  'Animal Welfare': animalWelfareImage,
  // Add more categories and corresponding images as needed
};

const PastActivitiesScreen = ({ navigation, route }) => {
  const { organizationId } = route.params; // Get the organization ID from navigation params
  const [pastActivities, setPastActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastActivities = async () => {
      try {
        const response = await axios.get(`https://volunteersphere.onrender.com/activities/past/${organizationId}`);
        if (response.status === 200 && response.data.length > 0) {
          setPastActivities(response.data);
          setError(null);
        } else {
          setPastActivities([]);
          setError('No past activities found.');
        }
      } catch (error) {
        console.error('Error fetching past activities:', error);
        setError('Unable to fetch past activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPastActivities();
  }, [organizationId]);

  // Component to display each posting
  const renderActivityItem = ({ item }) => {
    // Select the image based on the category of the opportunity
    const selectedImage = categoryImages[item.category] || healthImage; // Default to healthImage if category not found

    return (
      <View style={styles.card}>
        {/* Display the selected image */}
        <Image source={selectedImage} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.details}>{item.duration} of volunteering</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewSignUps', { opportunityId: item._id })}>
            <Text style={styles.buttonText}>View Sign-Ups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>📝</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.buttonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        {/* View Reviews Button */}
        <TouchableOpacity style={styles.reviewButton} onPress={() => navigation.navigate('ViewReviews', { opportunityId: item._id })}>
          <Text style={styles.reviewButtonText}>View Reviews</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Activities</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff8c00" />
      ) : error ? (
        <View style={styles.noActivitiesContainer}>
          <Text style={styles.noActivitiesText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={pastActivities}
          keyExtractor={item => item._id.toString()}
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
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 5,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  editButton: {
    marginLeft: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    marginLeft: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
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

export default PastActivitiesScreen;
