import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

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
  const [signups, setSignups] = useState([]); // State to store fetched signups
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Log the opportunity object to debug what is being passed
    console.log('Opportunity object received in EachPosting:', opportunity);
  }, [opportunity]);

  // Fetch sign-ups for the given activity
  const fetchSignups = async () => {
    try {
      // Check if opportunity object contains activityId
      if (!opportunity.activityId) {
        console.error('No activityId found in opportunity object:', opportunity);
        return; // Exit early if activityId is missing
      }

      const response = await fetch(`https://volunteersphere.onrender.com/signups/${opportunity._id}`);
      
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSignups(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching signups:', error.message || error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Display the selected image */}
      <Image source={categoryImages[opportunity.category] || healthImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchSignups}>
          <Text style={styles.buttonText}>View Sign-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Modal to display the sign-ups */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Participants for {opportunity.name}</Text>
            <Text style={styles.participantsCount}>{signups.length} participants</Text>
            <ScrollView>
              {signups.map((signup, index) => (
                <View key={index} style={styles.signupItem}>
                  <Text style={styles.signupName}>
                    {signup.firstName} {signup.lastName} 
                  </Text>
                  <Text style={styles.signupStatus}>Status: {signup.status}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  participantsCount: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  signupItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  signupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  signupStatus: {
    fontSize: 14,
    color: 'grey',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EachPosting;
