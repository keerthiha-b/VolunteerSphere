import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import axios from 'axios';

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await axios.get('https://volunteersphere.onrender.com/api/missions'); // Replace with your backend URL
      setMissions(response.data); // Save missions to state
    } catch (error) {
      console.error('Error fetching missions:', error);
    }
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Environment':
        return <Icon name="nature" size={40} color="#4CAF50" />; // Environment icon
      case 'Community Service':
        return <Icon name="volunteer-activism" size={40} color="#FF6B6B" />; // Community service icon
      case 'Health and Wellness':
        return <Icon name="fitness-center" size={40} color="#FA7F35" />; // Health icon
      case 'Education':
        return <Icon name="school" size={40} color="#FFC107" />; // Education icon
      default:
        return <Icon name="help" size={40} color="#9E9E9E" />; // Default icon for unknown categories
    }
  };

  const renderMissionItem = ({ item }) => (
    <View style={styles.missionCard}>
      <View style={styles.missionHeader}>
        {getIconForCategory(item.category)} {/* Icon based on category */}
        <Text style={styles.missionTitle}>{item.title}</Text>
        <Text style={styles.favoriteIcon}>❤️</Text> {/* Example favorite icon */}
      </View>
      <View style={styles.progressContainer}>
        <Text>{item.progress >= item.goal ? 'Completed' : `${Math.round((item.progress / item.goal) * 100)}%`}</Text>
        <ProgressBar
          progress={item.progress / item.goal}
          color={item.progress >= item.goal ? '#4CAF50' : '#FA7F35'} // Green for completed, orange for progress
          style={styles.progressBar}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  missionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
});

export default MissionsPage;