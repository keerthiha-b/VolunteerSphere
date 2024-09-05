import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

// Import the static image for comments
const commentsImage = require('./images/comments.jpg'); // Adjust the path according to your project structure

const LeaveComment = ({ route, navigation }) => {
  const { userToActivityId } = route.params;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0); // State to manage star rating

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`https://volunteersphere.onrender.com/comments/${userToActivityId}`, { text: comment, rating });
      
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
      
      {/* Star Rating */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={32}
              color="#ff8c00"
            />
          </TouchableOpacity>
        ))}
      </View>

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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
