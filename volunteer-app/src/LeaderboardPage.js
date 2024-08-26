import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';

const LeaderboardPage = ({ route }) => {
  const { userId } = route.params; 
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`https://volunteersphere.onrender.com/leaderboard`, { params: { userId } });
        setLeaderboard(response.data.topUsers);
        if (response.data.currentUser) {
          setCurrentUser(response.data.currentUser);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Top 3 Display */}
      <View style={styles.topThreeContainer}>
        {leaderboard.slice(0, 3).map((user, index) => (
          <View key={index} style={styles.topUser}>
            <Image source={{ uri: 'path/to/user/image' }} style={styles.profileImage} />
            <Text style={styles.topUsername}>{user.username}</Text>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
        ))}
      </View>

      {/* List of Top 5 */}
      <FlatList
        data={leaderboard.slice(3, 5)}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item._id.toString()}
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
});

export default LeaderboardPage;
