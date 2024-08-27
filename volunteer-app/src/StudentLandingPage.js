import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from 'react-native-paper';
import { save, getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed

import character from './images/PlayerChar.png';
import leaderboardIcon from './images/buttonicons/LeaderboardIcon.png';
import missionIcon from './images/buttonicons/MissionsIcon.png';

const StudentLandingPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [progress, setProgress] = useState({ level: 1, points: 0, maxPoints: 1000 });

  // Function to initialize user data
  const initializeUserData = async () => {
    try {
      const storedName = await getValueFor("name");
      const storedId = await getValueFor("userId");
      
      if (storedName && storedId) {
        setUsername(storedName);
        setId(storedId);
      } else {
        Alert.alert('Error', 'Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    initializeUserData();
  }, []);

  // Fetch progress data when ID is set
  useEffect(() => {
    // Check if the ID is valid and not empty or '0'
    if (id && id !== '0') {
      getProgress();
    }
  }, [id]);

  const getProgress = async () => {
    try {
      const response = await fetch('https://volunteersphere.onrender.com/get-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (response.ok) {
        setProgress(data);
      } else {
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', data.errorMsg || 'Could not fetch progress data');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { name: username })}>
        <Text style={styles.gearText}>⚙️</Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.centeredImageContainer}>
        <Image source={character} style={styles.playerChar} />
      </SafeAreaView>
      
      <Text style={styles.greeting}>Welcome back, {username || 'User'} </Text>

      <Text style={styles.title}>What would you like to do?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('MapScreen')}>
          <Text style={styles.optionButtonText}>Find new opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Manage your sign ups</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Add comments to past sign ups</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Check your awards</Text>
        </TouchableOpacity>
      </View> 
      
      <ProgressBar progress={progress.points / progress.maxPoints} style={styles.progressBarStyle} color={"#FA7F35"} visible={true} />
    
      <View style={styles.smallOptionsContainer}>
        <TouchableOpacity style={styles.smallOptionButton}>
          <Image source={leaderboardIcon} style={styles.leaderboardIconStyle} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallOptionButton}>
          <Image source={missionIcon} style={styles.missionsIconStyle} />
        </TouchableOpacity>
      </View> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#ffff',
  },
  profileGear: {
    alignItems: 'flex-start',
  },
  centeredImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 75
  },
  playerChar: {
    width: 100,
    height: 100
  },
  leaderboardIconStyle: {
    width: 30,
    height: 30
  },
  missionsIconStyle: {
    width: 25,
    height: 25
  },
  gearText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#FA7F35',
    padding: 0,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 100,
  },
  optionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBarStyle: {
    marginTop: 100,
    marginLeft: 150,
    bottom: 20,
    height: 50, 
    width: 200,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE', 
  },
  smallOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    bottom: 70,
    width: '40%'
  },
  smallOptionButton: {
    backgroundColor: '#EEEEEE',
    padding: 0,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 50,
  },
});

export default StudentLandingPage;