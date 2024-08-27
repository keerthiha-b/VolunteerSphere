import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';

// Import images for each category
const images = {
  health: require('./images/Health.jpg'),
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
};

const ActivityDetailScreen = ({ route, navigation }) => {
  const { activity, userId } = route.params;

  const handleSignup = () => {
    const apiUrl = 'https://volunteersphere.onrender.com/signup'; 
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId, // Assuming you have the userId from a user context or login
        opportunityId: activity.id,
      })
    })
    .then((response) => response.json())
    .then((data) => {
      Alert.alert("Success", data.message || "You have successfully signed up!");
      navigation.navigate('ActivitySignup', {
        activityName: activity.name,
        date: activity.date,
        time: activity.duration,
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert("Error", "Unable to sign up. Please try again later.");
    });
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
