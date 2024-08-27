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
    const storedName = await getValueFor("name");
    const storedId = await getValueFor("userId");
    setUsername(storedName);
    setId(storedId);
  };

  // ON BOOT
  useEffect(() => {
    initializeUserData();
  }, []);

  useEffect(() => {
    if (username) {
      // getProgress();
      getAvatar();
    }
  }, [username]);

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
      console.log('Received progress data:', data); // Log the received data

      if (response.ok) {
        setProgress(data);
      } else {
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', 'Could not fetch progress data');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data');
    }
  };

  const getAvatar = async () => {
    
    try {
      const response = await fetch('https://volunteersphere.onrender.com/get-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      console.log('Received progress data:', data); // Log the received data

      if (response.ok) {
        setCurrAvatar(data.avatar);
      } else {
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', 'Could not fetch progress data');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Network Error', 'Could not fetch progress data');
    }
  };

  const setAvatar = async (avatarName) => {
    console.log('Setting avatar:', avatarName);
    console.log('Id', id);
    try {
      const response = await fetch('https://volunteersphere.onrender.com/set-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, avatarName })
      });

      const data = await response.json();
      console.log('Received progress data:', data); // Log the received data

      if (response.ok) {
        Alert.alert('Success', 'Successfully updated avatar');
        setCurrAvatar(avatarName);
      } else {
        console.error('Error getting progress:', data.errorMsg);
        Alert.alert('Error', 'Could not fetch progress data');
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

      <TouchableOpacity style={styles.centeredImageContainer} onPress={() => setAvatar("Default.png")}>
        <Image
          source={avatarDictionary[currAvatar]} // Update this path to the location of your image file
          style={styles.playerChar}
        />
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("Construction.png")}>
            <Image
            source={Construction} // Update this path to the location of your image file
            style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("FireFighter.png")}>
            <Image
                source={FireFighter} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("Goggles.png")}>
            <Image
                source={Goggles} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("Headphones.png")}>
            <Image
                source={Headphones} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("Nurse.png")}>
            <Image
                source={Nurse} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => setAvatar("Pilot.png")}>
            <Image
                source={Pilot} // Update this path to the location of your image file
                style={styles.playerChar}
            />
        </TouchableOpacity>
      </View> 
      
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
