import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const CommentsScreen = ({ route }) => {
  const { opportunityId } = route.params; // Make sure this parameter is passed from the previous screen
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Using the provided server name and the correct endpoint for fetching comments
        const response = await axios.get(`https://volunteersphere.onrender.com/admin/comments/${opportunityId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [opportunityId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {comments.length === 0 ? (
          <Text style={styles.noReviewsText}>No review yet</Text>
        ) : (
          comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentAuthor}>
                {comment.userToActivityId?.firstName} {comment.userToActivityId?.lastName}
              </Text>
              <Text style={styles.commentUsername}>Review: {comment.userToActivityId?.username}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentRating}>Rating: {comment.rating || 'No rating given'}</Text>
              <Text style={styles.commentDate}>{new Date(comment.date).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background for the entire screen
  },
  content: {
    padding: 16,
  },
  commentContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFEDD5', // Light orange background for comments
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    color: '#666', // Gray color for the username
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 8,
  },
  commentRating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#888', // Lighter gray for date
    textAlign: 'right',
  },
  noReviewsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CommentsScreen;
