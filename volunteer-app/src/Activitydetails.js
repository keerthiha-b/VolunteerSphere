import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getValueFor } from './utils/secureStoreUtil'; // Import secure storage utility
import axios from 'axios';

const images = {
  health: require('./images/Health.jpg'),
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
};

const ActivityDetailScreen = ({ route, navigation }) => {
  const { activity } = route.params; // Getting activity details from route params
  const [userId, setUserId] = useState(null); // State to store fetched userId

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await getValueFor('userId'); // Retrieve userId from secure storage
        if (!storedUserId) {
          throw new Error('User ID not found in secure storage.');
        }
        setUserId(storedUserId);
        console.log('Fetched userId from secure storage:', storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please log in again.');
      }
    };

    fetchUserId(); // Call the function to fetch userId on component mount
  }, []);

  const handleSignup = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    const apiUrl = 'https://volunteersphere.onrender.com/signup';

    const payload = {
      userId: userId, // Use the fetched userId from secure storage
      opportunityId: activity._id, // Use the activity ID from the route params
    };

    console.log("Sending payload:", payload); // Log the payload being sent

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        Alert.alert("Success", response.data.message || "You have successfully signed up!");
        navigation.navigate('Signupactivity', {
          activityName: activity.name,
          date: activity.date,
          time: activity.duration,
        });
      } else {
        Alert.alert('Error', response.data.message || 'Unable to sign up. Please try again later.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert("Error", "Unable to sign up. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={images[activity.category.toLowerCase()] || images['default']} style={styles.image} />
      <Text style={styles.title}>{activity.name}</Text>
      <Text>Category: {activity.category}</Text>
      <Text>Duration: {activity.duration}</Text>
      <Text>Date: {activity.date}</Text>
      <Text>Address: {activity.address}</Text>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  signupButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActivityDetailScreen;
