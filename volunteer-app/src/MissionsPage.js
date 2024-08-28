import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import axios from 'axios';

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchMissions = async () => {
      try {
        const response = await axios.get('https://volunteersphere.onrender.com/api/missions');
        console.log('Fetched missions data:', response.data);

        if (isMounted && Array.isArray(response.data)) {
          setMissions(response.data); // Set missions only if the component is mounted and data is an array
        } else {
          console.error('Unexpected data format, expected an array.');
        }
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };

    fetchMissions();

    return () => {
      isMounted = false; // Cleanup when the component unmounts
    };
  }, []);

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

  const renderMissionItem = ({ item }) => {
    // Ensure everything is properly handled and wrapped inside <Text> components
    return (
      <View style={styles.missionCard}>
        <View style={styles.missionHeader}>
          {getIconForCategory(item.category)} {/* Icon based on category */}
          <Text style={styles.missionTitle}>{item.title}</Text> {/* Mission title */}
          <Text style={styles.favoriteIcon}>❤️</Text> {/* Example favorite icon */}
        </View>
        <Text>{item.description}</Text> {/* Mission description */}
        <View style={styles.progressContainer}>
          <Text>{item.progress >= item.goal ? 'Completed' : `${Math.round((item.progress / item.goal) * 100)}%`}</Text> {/* Mission progress */}
          <ProgressBar
            progress={item.progress / item.goal}
            color={item.progress >= item.goal ? '#4CAF50' : '#FA7F35'} // Green for completed, orange for progress
            style={styles.progressBar}
          />
        </View>
        <Text>Points: {item.points.toString()}</Text> {/* Ensure points is treated as a string */}
        <Text>Goal: {item.goalType === 'hours' ? `${item.goal} hours` : `${item.goal} activities`}</Text> {/* Goal */}
        <Text>Expires on: {new Date(item.expirationDate).toLocaleDateString()}</Text> {/* Expiration date */}
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item._id.toString()} // Ensure key is a string
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