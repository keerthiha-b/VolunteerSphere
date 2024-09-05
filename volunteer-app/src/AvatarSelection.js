import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { save, getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed
import { ProgressBar, MD3Colors } from 'react-native-paper';

// IMAGES
import character from './images/PlayerChar.png'; //default
import Construction from './images/Avatars/Construction.png';
import FireFighter from './images/Avatars/FireFighter.png';
import Goggles from './images/Avatars/Goggles.png';
import Headphones from './images/Avatars/Headphones.png';
import Nurse from './images/Avatars/Nurse.png';
import Pilot from './images/Avatars/Pilot.png';

const AvatarSelection = ({ navigation }) => {
  const [username, setUsername] = useState('user');
  const [id, setId] = useState(0);
  const [progress, setProgress] = useState({ level: 1, points: 0, maxPoints: 1000 });
  const [currAvatar, setCurrAvatar] = useState('Default.png');

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
        Alert.alert('Error', 'Invalid user ID format. Please log in again.');
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      Alert.alert('Error', 'Failed to initialize user data.');
    }
  };

  // ON BOOT
  useEffect(() => {
    initializeUserData();
  }, []);

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
        console.error('User ID is not available for fetching progress.');
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

  const setAvatar = async (avatarName, minLevel) => {
    try {
      if (!id) {
        console.error('User ID is not available for fetching progress.');
        return;
      }
      
      if (progress.level < minLevel) {
        Alert.alert('Attention', 'Cannot equip avatar - must be level ' + minLevel + ' to equip');
        return;
      }

      const response = await fetch('https://volunteersphere.onrender.com/set-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, avatar: avatarName })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', data.errorMsg || 'Could not fetch progress data.');
        return;
      }

      const data = await response.json();
      console.log('Received progress data:', data); // Log the received data
      getAvatar();
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data.');
    }
  };

  const determineButtonStyle = (minLevel) => {
    if (progress.level >= minLevel) {
      return styles.optionButtonAvailable;
    }
    else {
      return styles.optionButtonUnavailable;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { name: username })}>
        <Text style={styles.gearText}>⚙️</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.centeredImageContainer} onPress={() => setAvatar("Default.png")}>
        <Image
          source={avatarDictionary[currAvatar]} // Update this path to the location of your image file
          style={styles.playerChar}
        />
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButtonAvailable} onPress={() => setAvatar("Construction.png", 0)}>
            <Image
            source={Construction} // Update this path to the location of your image file
            style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButtonAvailable} onPress={() => setAvatar("FireFighter.png", 0)}>
            <Image
                source={FireFighter} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={determineButtonStyle(1)} onPress={() => setAvatar("Goggles.png", 1)}>
          {progress.level < 1 && <TouchableOpacity style={styles.diagonalLine}/>} 
            <Image
                source={Goggles} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={determineButtonStyle(2)} onPress={() => setAvatar("Headphones.png", 2)}>
         {progress.level < 2 && <TouchableOpacity style={styles.diagonalLine}/>}
            <Image
                source={Headphones} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={determineButtonStyle(3)} onPress={() => setAvatar("Nurse.png", 3)}>
          {progress.level < 3 && <TouchableOpacity style={styles.diagonalLine}/>}
            <Image
                source={Nurse} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={determineButtonStyle(4)} onPress={() => setAvatar("Pilot.png", 4)}>
         {progress.level < 4 && <TouchableOpacity style={styles.diagonalLine}/>}
            <Image
                source={Pilot} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>
      </View> 
      
      <Text style={styles.progLevel}> 
        Level {progress.level} 
        <Text style={styles.progPoints}> 🔸 {progress.points} / {progress.maxPoints} pt </Text>
      </Text>
      <ProgressBar progress={progress.points / progress.maxPoints} style={styles.progressBarStyle} color={"#FA7F35"} visible={true} />
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
    flex: 1, // Make the container fill the available space
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    marginBottom: 75,
    marginTop: 20
  },
  progLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
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
  optionButtonAvailable: {
    backgroundColor: '#FA7F35',
    padding: 0,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 100,
  },
  optionButtonUnavailable: {
    backgroundColor: '#FA7F35',
    borderColor: '#ba1e28',
    borderWidth: 5,
    padding: 0,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 100,
  },
  diagonalLine: {
    position: 'absolute',
    top: 42,
    left: 15,
    width: 135, // Ensure it covers the box diagonally
    height: 5, // Thickness of the line
    backgroundColor: '#ba1e28', // Line color
    transform: [{ rotate: '45deg' }], // Rotate to create the diagonal
    zIndex: 100
  },
  optionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBarStyle: {
    marginTop: 30,
    marginLeft: 75,
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

export default AvatarSelection;
