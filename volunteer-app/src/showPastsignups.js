import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const SignUps = ({ route }) => {
  const { activityId } = route.params; // Get the activityId from route params
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await fetch(`https://volunteersphere.onrender.com/signups/${activityId}`);
        
        if (!response.ok) {
          console.error('Server error:', response.status, response.statusText);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSignups(data);
      } catch (error) {
        console.error('Error fetching signups:', error.message || error);
        Alert.alert('Error', 'Failed to load signups.');
      }
    };

    fetchSignups();
  }, [activityId]);

  // Function to handle certificate approval
  const handleApprove = async (signupId) => {
    try {
      console.log(`Approving signup with ID: ${signupId}`); // Debugging statement

      // Trigger certificate generation API call
      const response = await fetch(`https://volunteersphere.onrender.com/api/generate-certificate/${signupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Certificate generated successfully!');
        console.log('Certificate generated successfully!'); // Debugging statement
        // Optionally, update the UI or state if needed
      } else {
        console.error('Error generating certificate:', response.status, response.statusText);
        Alert.alert('Error', 'Failed to generate certificate.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while generating the certificate.');
    }
  };

  // Function to handle decline action
  const handleDecline = (signupId) => {
    console.log(`Declined signup with ID: ${signupId}`); // Debugging statement
    Alert.alert('Declined', `Signup for ID: ${signupId} has been declined.`);
    // Optionally, make an API call or update state to reflect the decline
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participants</Text>
      {signups.length === 0 ? (
        <Text>No signups for this activity.</Text>
      ) : (
        <FlatList
          data={signups}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={[styles.signupItem, index % 2 === 0 ? styles.orangeBackground : styles.grayBackground]}>
              {/* Participant Info and Buttons Container */}
              <View style={styles.infoContainer}>
                <Text style={styles.participantNumber}>{index + 1}.</Text>
                <Text style={styles.signupName}>
                  {item.firstName} {item.lastName}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item._id)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleDecline(item._id)}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  signupName: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  orangeBackground: {
    backgroundColor: 'orange',
  },
  grayBackground: {
    backgroundColor: '#f0f0f0', // Light gray color
  },
});

export default SignUps;
