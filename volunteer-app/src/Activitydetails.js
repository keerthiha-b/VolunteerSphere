import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { getValueFor } from './utils/secureStoreUtil'; // Import secure storage utility
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Import images for each category
const images = {
  health: require('./images/Health.jpg'),
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
};

const Tab = createMaterialTopTabNavigator();

// const CommunityTab = ({ userToActivityId }) => {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`https://volunteersphere.onrender.com/comments/${userToActivityId}/comments`);
//         if (response.status === 200) {
//           setComments(response.data);
//         } else {
//           console.error('Error fetching comments:', response.data.errorMsg);
//           Alert.alert('Error', 'Unable to fetch comments. Please try again later.');
//         }
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//         Alert.alert('Error', 'Unable to fetch comments. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComments();
//   }, [userToActivityId]);

//   const renderCommentItem = ({ item }) => (
//     <View style={styles.commentContainer}>
//       <Text style={styles.commentUser}>{item.userToActivityId.firstName} {item.userToActivityId.lastName}</Text>
//       <Text style={styles.commentText}>{item.text}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.tabContent}>
//       {loading ? (
//         <Text>Loading comments...</Text>
//       ) : comments.length > 0 ? (
//         <FlatList
//           data={comments}
//           keyExtractor={(item) => item._id.toString()}
//           renderItem={renderCommentItem}
//         />
//       ) : (
//         <Text>No comments available for this activity.</Text>
//       )}
//     </View>
//   );
// };

const DetailsTab = ({ activity }) => (
  <View style={styles.tabContent}>
    <Text>Category: {activity.category}</Text>
    <Text>Duration: {activity.duration}</Text>
    <Text>Date: {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}</Text>
    <Text>Address: {activity.address}</Text>
  </View>
);

const ActivityDetailScreen = ({ route, navigation }) => {
  const { activity, userToActivityId } = route.params; // Getting activity details and userToActivityId from route params
  const [userId, setUserId] = useState(null); // State to store fetched userId

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await getValueFor('userId'); // Retrieve userId from secure storage
        if (!storedUserId) {
          throw new Error('User ID not found in secure storage.');
        }
        setUserId(storedUserId);
        console.log('Fetched userId from secure storage:', storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please log in again.');
      }
    };

    fetchUserId(); // Call the function to fetch userId on component mount
  }, []);

  const handleSignup = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    const apiUrl = 'https://volunteersphere.onrender.com/signup';

    const payload = {
      userId: userId, // Use the fetched userId from secure storage
      opportunityId: activity._id, // Use the activity ID from the route params
    };

    console.log("Sending payload:", payload); // Log the payload being sent

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        Alert.alert("Success", response.data.message || "You have successfully signed up!");
        navigation.navigate('ActivitySignup', {
          activityName: activity.name,
          date: activity.date,
          time: activity.duration,
          location: activity.address
        });
      } else if (response.status === 409) { // Handle duplicate sign-up attempts
        Alert.alert('Conflict', response.data.message || 'You are already signed up for this activity.');
      } else {
        Alert.alert('Error', response.data.message || 'Unable to sign up. Please try again later.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMessage = error.response?.data?.errorMsg || "Unable to sign up. Please try again later.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={images[activity.category.toLowerCase()] || images['default']} style={styles.image} />
      <Text style={styles.title}>{activity.name}</Text>
      
      {/* Tab Navigator to switch between Details and Community tabs */}
      <Tab.Navigator>
        <Tab.Screen name="Details">
          {() => <DetailsTab activity={activity} />}
        </Tab.Screen>
        {/* <Tab.Screen name="Community">
          {() => <CommunityTab userToActivityId={userToActivityId} />}
        </Tab.Screen> */}
      </Tab.Navigator>

      {/* Signup Button below the tabs */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling for the screen and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  tabContent: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  signupButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 50,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // commentContainer: {
  //   backgroundColor: '#fff',
  //   padding: 10,
  //   marginVertical: 5,
  //   borderRadius: 5,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowRadius: 2,
  //   elevation: 2,
  // },
  // commentUser: {
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  // commentText: {
  //   color: '#333',
  // },
});

export default ActivityDetailScreen;