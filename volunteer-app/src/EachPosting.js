import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { getValueFor } from './utils/secureStoreUtil'; // Ensure this path is correct
import axios from 'axios';

// Import the images
import healthImage from './images/Health.jpg';
import environmentImage from './images/cleaning.jpg';
import educationImage from './images/education.jpg';
import communityServiceImage from './images/community.jpg';
import animalWelfareImage from './images/animalwelfare.png';
import { findOneAndDelete } from '../backend/Schema/User';

// Map categories to corresponding images
const categoryImages = {
  Health: healthImage,
  Environment: environmentImage,
  Education: educationImage,
  'Community Service': communityServiceImage,
  'Animal Welfare': animalWelfareImage,
  // Add more categories and corresponding images as needed
};

const EachPosting = ({ opportunity, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Select the image based on the category of the opportunity
  const selectedImage = categoryImages[opportunity.category] || healthImage; // Default to healthImage if category not found


  // Function to handle the actual deletion
  const handleDelete = async () => {
    setModalVisible(false);  // Close the modal after confirmation
    try {
      const response = await axios.delete(`https://volunteersphere.onrender.com/activities/delete/${opportunity._id}`);
      console.log("Opportunity deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Display the selected image */}
      <Image source={selectedImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Sign-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this activity?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ff8c00', // Orange color for the button
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ddd', // Gray color for the "Cancel" button
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333', // Darker text color for the "Cancel" button
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EachPosting;
