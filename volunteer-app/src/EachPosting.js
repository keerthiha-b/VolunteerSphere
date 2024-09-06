import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import axios from 'axios'; // Add axios for API calls

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

const EachPosting = ({ opportunity, deleteActivityCallback }) => {
  const navigation = useNavigation(); // Initialize navigation
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  // Function to handle deleting the activity
  const deleteActivity = async () => {
    try {
      const response = await axios.post('https://volunteersphere.onrender.com/delete-activity', {
        activityId: opportunity._id,
      });

      if (response.status === 200) {
        setModalVisible(false); // Close modal
        deleteActivityCallback(opportunity._id); // Call the parent to remove the activity from the list
      }
    } catch (error) {
      console.error('Error deleting activity:', error);

      if (error.response && error.response.status === 400) {
        alert('Cannot Delete', `This activity has ${error.response.data.signupsCount} signups and cannot be deleted.`);
      } else {
        alert('Error', 'Failed to delete activity.');
      }
    }
  };

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
      <Image source={categoryImages[opportunity.category] || healthImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={viewSignups}>
          <Text style={styles.buttonText}>View Sign-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete {opportunity.name}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={deleteActivity}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
});

export default EachPosting;
