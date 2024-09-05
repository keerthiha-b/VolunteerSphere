import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

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

const EachPosting = ({ opportunity }) => {
  const navigation = useNavigation(); // Initialize navigation

  // Navigate to the SignUps screen with the activity ID
  const viewSignups = () => {
    if (opportunity._id) {
      navigation.navigate('Signups', { activityId: opportunity._id });
    } else {
      console.error('No activity ID found in opportunity object:', opportunity);
    }
  };

  return (
    <View style={styles.card}>
      {/* Display the selected image */}
      <Image source={categoryImages[opportunity.category] || healthImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={viewSignups}>
          <Text style={styles.buttonText}>View Sign-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonText: {
    color: 'white',
  },
});

export default EachPosting;
