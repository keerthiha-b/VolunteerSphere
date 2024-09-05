import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { View, Image, TouchableOpacity, Text, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { save, getValueFor, remove } from './utils/secureStoreUtil'; // Adjust the path as needed
import { ProgressBar } from 'react-native-paper';

// IMAGES
import character from './images/PlayerChar.png';
import leaderboardIcon from './images/buttonicons/LeaderboardIcon.png';
import missionIcon from './images/buttonicons/MissionsIcon.png';
import logoutIcon from './images/buttonicons/log-out.svg';
import MapScreen from './MapScreen';

// AVATAR IMAGES
import Construction from './images/Avatars/Construction.png';
import FireFighter from './images/Avatars/FireFighter.png';
import Goggles from './images/Avatars/Goggles.png';
import Headphones from './images/Avatars/Headphones.png';
import Nurse from './images/Avatars/Nurse.png';
import Pilot from './images/Avatars/Pilot.png';

const StudentLandingPage = ({ navigation }) => {
  const [username, setUsername] = useState('user');
  const [id, setId] = useState(null);
  const [progress, setProgress] = useState({ level: 1, points: 0, maxPoints: 1000 });
  const [currAvatar, setCurrAvatar] = useState('Default.png');
  const isFocused = useIsFocused();

  // avatar dictionary
  const avatarDictionary = {
    "Default.png": character,
    "Construction.png": Construction,
    "FireFighter.png": FireFighter,
    "Goggles.png": Goggles,
    "Headphones.png": Headphones,
    "Nurse.png": Nurse,
    "Pilot.png": Pilot
  }

  // Function to initialize user data
  const initializeUserData = async () => {
    try {
      const storedName = await getValueFor("name");
      const storedId = await getValueFor("userId");

      if (storedName) setUsername(storedName);

      // Validate that storedId is a valid 24-character hex string
      if (storedId && /^[0-9a-fA-F]{24}$/.test(storedId)) {
        setId(storedId);
      } else {
        console.error('Invalid ID format:', storedId);
        Alert.alert('Error', 'Invalid user ID format. Please log in  again.');
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      Alert.alert('Error', 'Failed to initialize user data.');
    }
  };

  useEffect(() => {
    initializeUserData();
  }, [])

  useEffect(() => {
    if (isFocused) {
      console.log("called when screen open or when back on screen "); 

      // Want to update possible progress
      if (id) {
        console.log(`Attempting to fetch progress for user ID: ${id}`); // Added log
        getAvatar();
        getProgress();
      }
   }
  },[isFocused]);

  // Fetch progress data when ID is set
  useEffect(() => {
    if (id) {
      console.log(`Attempting to fetch progress for user ID: ${id}`); // Added log
      getAvatar();
      getProgress();
    }
  }, [id]);

  const getProgress = async () => {
    try {
      if (!id) {
        console.error('User ID is not available for fetching progress.');
        return;
      }

      const response = await fetch('https://volunteersphere.onrender.com/get-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', data.errorMsg || 'Could not fetch progress data.');
        return;
      }

      const data = await response.json();
      console.log('Received progress data:', data); // Log the received data

      setProgress(data);
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data.');
    }
  };

  const getAvatar = async () => {
    try {
      if (!id) {
        console.error('User ID is not available for fetching avatar.');
        return;
      }

      console.log(id);

      const response = await fetch('https://volunteersphere.onrender.com/get-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', data.errorMsg || 'Could not fetch progress data.');
        return;
      }

      const data = await response.json();
      console.log('Received progress data:', data); // Log the received data

      setCurrAvatar(data.avatar);
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data.');
    }
  };

  const logOut = async () =>
  {
    await remove('name');
    await remove('email');
    await remove('userType');
    await remove('userId');
    navigation.navigate('LandingPage');
  }

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.profileGear}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { name: username })}>
          <Text style={styles.gearText}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logOut()}>
          <Text style={styles.gearText}>⬅️</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <TouchableOpacity style={styles.centeredImageContainer} onPress={() => navigation.navigate('AvatarSelection')}>
        <Image
          source={avatarDictionary[currAvatar]} // Update this path to the location of your image file
          style={styles.playerChar}
        />
      </TouchableOpacity>
      
      <Text style={styles.greeting}>Welcome back, {username} </Text>

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

        {/* <TouchableOpacity style={styles.optionButton} onPress={() => logOut()}>
          <Text style={styles.optionButtonText}>Log out</Text>
        </TouchableOpacity> */}
      </View> 
      
      <Text style={styles.progLevel}> 
        Level {progress.level} 
        <Text style={styles.progPoints}> 🔸 {progress.points} / {progress.maxPoints} pt </Text>
      </Text>
      
      <ProgressBar progress={progress.points / progress.maxPoints} style={styles.progressBarStyle} color={"#FA7F35"} visible={true}/>
    
      <View style={styles.smallOptionsContainer}>
        <TouchableOpacity style={styles.smallOptionButton}>
          <Image
            source={leaderboardIcon} // Update this path to the location of your image file
            style={styles.leaderboardIconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallOptionButton}>
          <Image
            source={missionIcon} // Update this path to the location of your image file
            style={styles.missionsIconStyle}
          />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -60,
    width: '20%'
  },
  centeredImageContainer: {
    flex: 1, // Make the container fill the available space
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    marginBottom: 75,
    marginTop: 60
  },
  playerChar: {
    width: 85,
    height: 85,
    resizeMode: 'contain'
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
  progLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: '#FA7F35',
    marginTop: 40
  },
  progPoints: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: '#FA7F35',
    marginTop: 40
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
    marginTop: 30,
    marginLeft: 150,
    bottom: 20,
    height: 50, 
    width: 200,
    borderRadius: 50, // Make the edges rounded
    overflow: 'hidden', // Ensure that the progress bar stays within rounded corners
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
