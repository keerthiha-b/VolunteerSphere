import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Dummy image for user avatar, replace with your own image if available
const userAvatar = require('./images/user-avatar.png'); // Ensure this path is correct

const AdminCommentsScreen = ({ route }) => {
  const { activityId, orgId } = route.params; // Get activityId and orgId from navigation params
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://volunteersphere.onrender.com/comments/${activityId}?orgId=${orgId}`);
        if (response.status === 200 && response.data.length > 0) {
          setComments(response.data);
          setError(null);
        } else {
          setComments([]);
          setError('No comments received yet.');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Unable to fetch comments. Please try again later.');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [activityId, orgId]);

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image source={userAvatar} style={styles.avatar} />
        <View style={styles.commentInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userHandle}>user: {item.userId}</Text>
        </View>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
      {/* Render the star rating */}
      <View style={styles.starRatingContainer}>
        {[...Array(item.rating)].map((_, index) => (
          <Text key={index} style={styles.star}>⭐</Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments for Activity</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff8c00" />
      ) : error ? (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={item => item._id.toString()}
          renderItem={renderCommentItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff8c00',
  },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userHandle: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    color: '#ff8c00',
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#555',
  },
});

export default AdminCommentsScreen;
