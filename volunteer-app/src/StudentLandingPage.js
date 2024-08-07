import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapboxWebView from './MapboxWebView';
import { save, getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed
import { ProgressBar, MD3Colors } from 'react-native-paper';

// IMAGES
import character from './images/PlayerChar.png';
import leaderboardIcon from './images/buttonicons/LeaderboardIcon.png';
import missionIcon from './images/buttonicons/MissionsIcon.png';

const StudentLandingPage = ({ navigation }) => {
  const [username, setUsername] = useState('user');
  const [id, setId] = useState(0);
  const [progress, setProgress] = useState({level: 1, points: 0, maxPoints: 1000});

  const name = getValueFor("name");

  // ON BOOT
  useEffect(() => {
    setUsername(getValueFor("name"));
    setId(getValueFor("userId"));
  }, []);

  useEffect(() => {
    getProgress();
  }, [username])

  const getProgress = async () => {
    console.log(id);
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
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { name })}>
        <Text style={styles.gearText}>⚙️</Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.centeredImageContainer}>
        <Image
          source={character} // Update this path to the location of your image file
          style={styles.playerChar}
        />
      </SafeAreaView>
      
      <Text style={styles.greeting}>Welcome back, {username} </Text>

      <Text style={styles.title}>What would you like to do?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('MapPage')}>
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
  notification: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  progressBarText: {
    fontSize: 24,
    color: '#EEEEEE'
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
