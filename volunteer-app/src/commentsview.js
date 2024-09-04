import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const CommentsScreen = ({ route }) => {
  const { opportunityId } = route.params; // Make sure this parameter is passed from the previous screen
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Using the provided server name and the correct endpoint for fetching comments
        const response = await axios.get(`https://volunteersphere.onrender.com/admin/comments/${opportunityId}`
        );
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
    <ScrollView>
      <View style={{ padding: 16 }}>
        {comments.map((comment, index) => (
          <View key={index} style={{ marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {comment.userToActivityId?.firstName} {comment.userToActivityId?.lastName}
            </Text>
            <Text>{comment.text}</Text>
            <Text>Rating: {comment.rating || 'No rating given'}</Text>
            <Text>{new Date(comment.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CommentsScreen;
