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
        setCurrentUser(response.data.currentUser);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  const renderLeaderboardItem = ({ item, index }) => {
    const isCurrentUser = item._id === userId;
    return (
      <View style={[styles.listItem, isCurrentUser && styles.currentUserContainer]}>
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

  const isCurrentUserInTop5 = leaderboard.some(user => user._id === userId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Top 3 Podium Display */}
      <View style={styles.podiumContainer}>
        {/* 2nd place */}
        <View style={[styles.podiumItem, styles.secondPlace]}>
          <Image source={{ uri: leaderboard[1]?.profileImageUrl || 'https://png.pngtree.com/png-vector/20220731/ourmid/pngtree-silver-medal-2nd-place-award-icon-png-image_6093704.png' }} style={styles.podiumImage} />
          <Text style={styles.podiumText}>2</Text>
          <Text style={styles.podiumUsername}>{leaderboard[1]?.username}</Text>
        </View>
        {/* 1st place */}
        <View style={[styles.podiumItem, styles.firstPlace]}>
          <Image source={{ uri: leaderboard[0]?.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/4350/4350539.png' }} style={styles.podiumImage} />
          <Text style={styles.podiumText}>1</Text>
          <Text style={styles.podiumUsername}>{leaderboard[0]?.username}</Text>
        </View>
        {/* 3rd place */}
        <View style={[styles.podiumItem, styles.thirdPlace]}>
          <Image source={{ uri: "https://png.pngtree.com/png-vector/20220731/ourmid/pngtree-3rd-place-bronze-medal-award-icon-png-image_6093735.png" }} style={styles.podiumImage} />
          <Text style={styles.podiumText}>3</Text>
          <Text style={styles.podiumUsername}>{leaderboard[2]?.username}</Text>
        </View>
      </View>

      {/* Orange Container for the list */}
      <View style={styles.orangeContainer}>
        <FlatList
          data={leaderboard.slice(0, 5)}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item._id.toString()}
        />

        {/* Display current user if not in top 5 */}
        {!isCurrentUserInTop5 && currentUser && (
          <View style={[styles.listItem, styles.currentUserContainer]}>
            <Text style={styles.username}>{currentUser.rank}. {currentUser.username}</Text>
            <Text style={styles.points}>{currentUser.points} pts</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28, // Adjust font size as needed
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#FA7F35', // Use the orange color you want for the title 
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  podiumItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  podiumImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  podiumText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  podiumUsername: {
    fontSize: 16,
    textAlign: 'center',
  },
  firstPlace: {
    height: 150,
    width:100,
    backgroundColor: '#FFE34D',
    borderRadius: 10,
    padding: 10,
  },
  secondPlace: {
    height: 135,
    width:100,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
  },
  thirdPlace: {
    height: 125,
    width:100,
    backgroundColor: '#E59965',
    borderRadius: 10,
    padding: 10,
  },
  orangeContainer: {
    backgroundColor: '#FA7F35', // Orange background
    padding: 10,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#fff', // White background for each list item
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10, // Space between items
  },
  username: {
    fontSize: 16,
  },
  points: {
    fontSize: 16,
  },
  currentUserContainer: {
    backgroundColor: '#d0e7ff', // Highlighted in blue for the current user
    borderRadius: 10,
    padding: 10,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LeaderboardPage;
