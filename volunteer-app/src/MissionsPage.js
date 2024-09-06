import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { getValueFor } from './utils/secureStoreUtil'; 

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [userId, setUserId] = useState(null);

  const fetchMissions = async () => {
    try {

      const storedUserId = await getValueFor("userId");
      if (!storedUserId) {
        Alert.alert("Login Required", "Please log in to view missions.");
        return;
      }
      setUserId(storedUserId);

      const response = await axios.get('https://volunteersphere.onrender.com/api/missions');
      if (Array.isArray(response.data)) {
        const missionsWithFavorites = response.data.map(mission => ({
          ...mission,
          isFavorite: false,  // Initialize all missions as not favorite
          completed: mission.completed || false
        }));
        setMissions(missionsWithFavorites);
      } else {
        console.error('Unexpected data format, expected an array.');
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMissions();
    }, [])
  );

  const toggleFavorite = (id) => {
    // Toggle the favorite status
    const updatedMissions = missions.map(mission =>
      mission._id === id ? { ...mission, isFavorite: !mission.isFavorite } : mission
    );
    setMissions(updatedMissions);
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Environment':
        return <Image source={require('./images/camping.png')} style={{ width: 40, height: 40 }} />;
      case 'Community Service':
        return <Image source={require('./images/community.jpg')} style={{ width: 40, height: 40 }} />;
      case 'Health and Wellness':
        return <Image source={require('./images/hospit.png')} style={{ width: 40, height: 40 }} />;
      case 'Education':
        return <Image source={require('./images/school.png')} style={{ width: 40, height: 40 }} />;
      default:
        return null;
    }
  };

  const filterMissions = (tab) => {
    switch (tab) {
      case 'all': 
        return missions;
      case 'favs': 
        return missions.filter(mission => mission.isFavorite);
      case 'completed':
        return missions.filter(mission => {
          const userProgress = mission.userProgresses.find(up => up.userId === userId);
          const progressPercent = userProgress ? Math.round((userProgress.progress / mission.goal) * 100) : 0;
          return progressPercent >= 100;
        });
      default: 
        return missions;
    }
  };

  useEffect(() => {
    missions.forEach(mission => {
      const userProgress = mission.userProgresses.find(up => up.userId === userId);
      const progressPercent = userProgress ? Math.round((userProgress.progress / mission.goal) * 100) : 0;

      if (progressPercent >= 100 && !mission.completed) {
        handleMissionCompletion(mission);
      }
    });
  }, [missions, userId]);

  const handleMissionCompletion = async (mission) => {
    // Call backend endpoint to update mission completion and user points
    console.log(mission._id);
    console.log(userId);

    try {
      const response = await axios.post('https://volunteersphere.onrender.com/api/missions/complete', {
        userId,
        missionId: mission._id
      });
      Alert.alert("Mission Completed", "Congratulations on completing the mission!");
      fetchMissions();  // Reload missions to reflect the updated status
    } catch (error) {
      console.error("Failed to complete mission:", error);
      Alert.alert("Error", "Failed to update mission completion.");
    }
  };

  const renderMissionItem = ({ item }) => {
    // Assuming 'currentUser' holds the current logged-in user's information
    const userProgress = item.userProgresses.find(up => up.userId === userId);
  
    // Calculate the percentage progress for the current user, capped at 100
    const progressPercent = userProgress
      ? Math.min(Math.round((userProgress.progress / item.goal) * 100), 100)
      : 0;
    
    return (
      <View style={styles.missionCard}>
        <View style={styles.missionHeader}>
          {getIconForCategory(item.category)}
          <Text style={styles.missionTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item._id)}>
            <Icon name={item.isFavorite ? "favorite" : "favorite-border"} style={[styles.favoriteIcon, item.isFavorite && styles.favActive]} />
          </TouchableOpacity>
        </View>
        <Text>{item.description}</Text>
        <View style={styles.pointsGoalContainer}>
          <Text style={styles.goal}>Goal: {item.goalType === 'hours' ? `${item.goal} hours` : `${item.goal} activities`}</Text>
          <Text style={styles.points}>Points: {item.points.toString()}</Text>
        </View>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progressPercent / 100} // Ensure this is a fraction
            color={progressPercent >= 100 ? '#4CAF50' : '#FA7F35'}
            style={styles.progressBar}
          />
          <Text style={styles.progressTextInsideBar}>
            {progressPercent}%
          </Text>
        </View>
        <View style={styles.expirationContainer}>
          <Text style={styles.expiration}>Expires on: {new Date(item.expirationDate).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Missions</Text>
      <View style={styles.tabContainer}>
        {['all', 'favs', 'completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filterMissions(selectedTab)}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    backgroundColor: '#FA7F35',
    padding: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  favActive: {
    color: 'orange', 
  },
  missionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginTop: 10,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
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
    fontSize: 24,
    color: '#FF6B6B',
  },
  pointsGoalContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  goal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,  // Adding space between Points and Goal
  },

  progressContainer: {
    position: 'relative', // Allows absolute positioning inside
    height: 30, // Thicker bar
  },
  progressBar: {
    borderRadius: 10,
    height: '100%', // Full height of the container
  },
  progressTextInsideBar: {
    position: 'absolute',
    left: 10,
    right: 0,
    top: 6,
    textAlign: 'left', // Center text horizontally
    color: '#6D4731', // Text color
    fontWeight: 'bold',
  },
  expirationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Aligns the text to the right
    marginTop: 10,               // Space from the progress bar
  },
  expiration: {
    fontSize: 12,
    color: '#666',
  },
});

export default MissionsPage;
