import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

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
      <Text style={styles.title}>Add a Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment here"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Submit" onPress={handleAddComment} />
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
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
});

export default LeaveComment;
