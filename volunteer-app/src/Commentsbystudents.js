import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { getValueFor } from './utils/secureStoreUtil'; // Ensure this path is correct
import axios from 'axios';

// Import images for each category
const images = {
  health: require('./images/Health.jpg'), // Ensure these paths are correct
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
};

const UserActivitiesScreen = ({ navigation }) => {
  const [signedUpActivities, setSignedUpActivities] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdAndActivities = async () => {
      try {
        const storedUserId = await getValueFor('userId');
        if (!storedUserId) {
          throw new Error('User ID not found in secure storage.');
        }
        setUserId(storedUserId);

        const response = await axios.get(`https://volunteersphere.onrender.com/user-activities/${storedUserId}`);
        if (response.status === 200) {
          console.log('API Response:', response.data);
          setSignedUpActivities(response.data);
        } else {
          console.log('No activities found for this user.');
          Alert.alert('Notice', 'No activities found for this user.');
          setSignedUpActivities([]); // Set to empty array if no activities are found
        }
      } catch (error) {
        console.error('Error fetching signed-up activities:', error);
        Alert.alert('Error', 'Unable to fetch your signed-up activities. Please try again later.');
      }
    };

    fetchUserIdAndActivities();
  }, []);

  const handleRemoveActivity = async (activityId) => {
    try {
      const response = await axios.delete(`https://volunteersphere.onrender.com/user-activities/${userId}/${activityId}`);
      if (response.status === 200) {
        Alert.alert("Success", "You have successfully removed the activity.");
        setSignedUpActivities(signedUpActivities.filter(activity => activity.opportunityId._id !== activityId));
      } else {
        Alert.alert('Error', 'Unable to remove the activity. Please try again later.');
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      Alert.alert("Error", "Unable to remove the activity. Please try again later.");
    }
  };

  const renderActivityItem = ({ item }) => {
    const isPastActivity = new Date(item.opportunityId.date) < new Date();
    const activityImage = images[item.opportunityId.category.toLowerCase()] || images['default'];
    
    return (
      <View style={styles.activityContainer}>
        <Image source={activityImage} style={styles.activityImage} />
        <Text style={styles.activityTitle}>{item.opportunityId.name}</Text>
        <Text style={styles.activityDetails}>{item.opportunityId.organization}</Text>
        <Text style={styles.activityDetails}>{item.opportunityId.duration} of volunteering</Text>

        {isPastActivity ? (
          <TouchableOpacity 
            style={styles.commentButton} 
            onPress={() => navigation.navigate('LeaveComment', { userToActivityId: item._id })}>
            <Text style={styles.commentButtonText}>Leave comment on past signup</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.unenrollButton} 
            onPress={() => handleRemoveActivity(item.opportunityId._id)}>
            <Text style={styles.unenrollButtonText}>Unenroll</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Signups and Reviews</Text>
      <FlatList
        data={signedUpActivities}
        keyExtractor={item => item._id.toString()}
        renderItem={renderActivityItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff8c00', // Color to match your design
  },
  activityContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  activityImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  unenrollButton: {
    backgroundColor: '#ff8c00', // Orange color for the "Unenroll" button
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  unenrollButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentButton: {
    backgroundColor: '#ff8c00', // Orange color for the "Leave comment" button
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserActivitiesScreen;
