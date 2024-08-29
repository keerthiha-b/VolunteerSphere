import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

// Import the static image for comments
const commentsImage = require('./images/comments.jpg'); // Adjust the path according to your project structure

const LeaveComment = ({ route, navigation }) => {
  const { userToActivityId } = route.params;
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`https://volunteersphere.onrender.com/comments/${userToActivityId}`, { text: comment });
      
      if (response.status === 201) {
        Alert.alert("Success", "Comment added successfully.");
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        Alert.alert('Error', 'Unable to add comment. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert("Error", "Unable to add comment. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your review here"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Display the static image for comments at the bottom */}
      <Image source={commentsImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center', // Center the contents horizontally
  },
  image: {
    width: 400, // Adjust the width as needed
    height: 400, // Adjust the height as needed
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 100,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#ff8c00', // Orange color for the "Submit" button
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Full width for better button appearance
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaveComment;
