import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { filter } from 'obscenity';

const customWords = [
  'stupid', 'idiot', 'dumb', 'crazy', 'hate', 'bad', 'horrible', 'terrible',
  'awful', 'disgusting', 'boring', 'useless', 'nasty', 'silly', 'fool', 'ugly',
  'damn', 'hell','suck'
];

filter.add(customWords);

const LeaveComment = ({ route, navigation }) => {
  const { userToActivityId } = route.params;
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    // Check for inappropriate language using obscenity filter
    if (filter.isObscene(comment)) {
      Alert.alert('Warning', 'Please avoid using inappropriate language.');
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
      <Text style={styles.title}>Add a Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment here"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      {/* Add your image below */}
      <Image source={require('./images/comments.jpg')} style={styles.image} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 100,
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    marginTop: 20,
    alignSelf: 'center',
    width: 400, // Adjust the size as needed
    height: 400, // Adjust the size as needed
    resizeMode: 'contain',
  },
});

export default LeaveComment;
