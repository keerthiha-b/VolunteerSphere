import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';

const LeaderboardPage = ({ route }) => {
  const { userId } = route.params; 
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`https://volunteersphere.onrender.com/leaderboard`, { params: { userId } });
        setLeaderboard(response.data.topUsers);
        if (response.data.currentUser) {
          setCurrentUser(response.data.currentUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  const renderLeaderboardItem = ({ item, index }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.username}>{index + 1}. {item.username}</Text>
        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No leaderboard data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Top 3 Display */}
      <View style={styles.topThreeContainer}>
        {leaderboard.slice(0, 3).map((user, index) => (
          <View key={index} style={styles.topUser}>
            {/* Replace with actual user image URLs if available, otherwise use a default placeholder */}
            <Image source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
            <Text style={styles.topUsername}>{user.username}</Text>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
        ))}
      </View>

      {/* List of Top 5 */}
      <FlatList
        data={leaderboard.slice(3, 5)}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()} // Use `_id` or fallback to index
      />

      {/* Display current user if not in top 5 */}
      {currentUser && (
        <View style={styles.currentUserContainer}>
          <Text style={styles.username}>{currentUser.rank}. {currentUser.username}</Text>
          <Text style={styles.points}>{currentUser.points} pts</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  topUser: {
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  topUsername: {
    fontSize: 16,
  },
  rankNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  username: {
    fontSize: 16,
  },
  points: {
    fontSize: 16,
  },
  currentUserContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LeaderboardPage;
