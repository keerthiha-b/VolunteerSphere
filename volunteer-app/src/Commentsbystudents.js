import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, Modal, Button } from 'react-native';
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [activityToUnenroll, setActivityToUnenroll] = useState(null);
  const [currentTab, setCurrentTab] = useState('upcoming');

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
          setSignedUpActivities(response.data);
        } else {
          Alert.alert('Notice', 'No activities found for this user.');
          setSignedUpActivities([]);
        }
      } catch (error) {
        console.error('Error fetching signed-up activities:', error);
        Alert.alert('Error', 'Unable to fetch your signed-up activities. Please try again later.');
      }
    };

    fetchUserIdAndActivities();
  }, []);

  const handleRemoveActivity = async (activityId) => {
    setShowConfirmationModal(false); // Hide modal after user confirms
    try {
      const response = await axios.delete(`https://volunteersphere.onrender.com/user-activities/${userId}/${activityId}`);
      if (response.status === 200) {
        Alert.alert('Success', 'You have successfully removed the activity.');
        setSignedUpActivities((prevActivities) => 
          prevActivities.filter(activity => activity.opportunityId._id !== activityId)
        );
      } else {
        Alert.alert('Error', 'Unable to remove the activity. Please try again later.');
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      Alert.alert('Error', 'Unable to remove the activity. Please try again later.');
    }
  };

  const confirmUnenroll = (activityId) => {
    setActivityToUnenroll(activityId);
    setShowConfirmationModal(true);
  };

  const renderActivityItem = ({ item }) => {
    const isPastActivity = new Date(item.opportunityId.date) < new Date();
    const activityImage = images[item.opportunityId.category.toLowerCase()] || images['default'];
    
    const formattedDate = new Date(item.opportunityId.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = new Date(item.opportunityId.date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.activityContainer}>
        <Image source={activityImage} style={styles.activityImage} />
        <Text style={styles.activityTitle}>{item.opportunityId.name}</Text>
        <Text style={styles.activityDetails}>{item.opportunityId.organization}</Text>
        <Text style={styles.activityDetails}>{item.opportunityId.duration} of volunteering</Text>
        <Text style={styles.activityDetails}>{formattedDate} at {formattedTime}</Text>

        {isPastActivity ? (
          <TouchableOpacity 
            style={styles.commentButton} 
            onPress={() => navigation.navigate('Leave Comment', { userToActivityId: item._id })}>
            <Text style={styles.commentButtonText}>Leave a comment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.unenrollButton} 
            onPress={() => confirmUnenroll(item.opportunityId._id)}>
            <Text style={styles.unenrollButtonText}>Unenroll</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const filteredActivities = signedUpActivities.filter(activity => 
    currentTab === 'upcoming' ? new Date(activity.opportunityId.date) >= new Date() : new Date(activity.opportunityId.date) < new Date()
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={currentTab === 'upcoming' ? styles.activeTab : styles.inactiveTab} onPress={() => setCurrentTab('upcoming')}>
          <Text style={currentTab === 'upcoming' ? styles.activeTabText : styles.inactiveTabText}>Upcoming Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={currentTab === 'past' ? styles.activeTab : styles.inactiveTab} onPress={() => setCurrentTab('past')}>
          <Text style={currentTab === 'past' ? styles.activeTabText : styles.inactiveTabText}>Past Activities</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredActivities}
        keyExtractor={item => item._id.toString()}
        renderItem={renderActivityItem}
      />

      {/* Unenroll Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to unenroll from this activity?</Text>
            <Button title="Cancel" onPress={() => setShowConfirmationModal(false)} />
            <Button title="Unenroll" onPress={() => handleRemoveActivity(activityToUnenroll)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activeTab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ff8c00',
    alignItems: 'center',
  },
  inactiveTab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#888',
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
    backgroundColor: '#ff8c00',
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
    backgroundColor: '#ff8c00',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
});

export default UserActivitiesScreen;
