import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
};

const ApprovalActivitiesList = ({ opportunity }) => {
  const navigation = useNavigation();

  // Function to navigate to the SignUps screen with the activity ID
  const handleApproveCertificates = () => {
    if (opportunity._id) {
      navigation.navigate('PastActivities', { activityId: opportunity._id });
    } else {
      console.error('No activity ID found in opportunity object:', opportunity);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={categoryImages[opportunity.category] || healthImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleApproveCertificates}>
          <Text style={styles.buttonText}>Approve Certificates</Text>
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
    height: 200, // Reduced height for a more compact view
    borderRadius: 5,
    marginBottom: 8,
  },
  title: {
    fontSize: 18, // Slightly larger font for better readability
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
    justifyContent: 'center',
    marginTop: 10, // Added margin to separate the button from text
  },
  button: {
    backgroundColor: '#FF7F50', // Changed to a softer orange for better aesthetics
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ApprovalActivitiesList;
