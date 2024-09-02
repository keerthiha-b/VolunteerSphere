import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Linking } from 'react-native';

const ApproveSignUps = ({ route }) => {
  const { activityId } = route.params; // Get the activityId from route params
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await fetch(`https://volunteersphere.onrender.com/api/userApproval/past/${activityId}`);
        
        if (!response.ok) {
          console.error('Server error:', response.status, response.statusText);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSignups(data);
      } catch (error) {
        console.error('Error fetching signups:', error.message || error);
      }
    };

    fetchSignups();
  }, [activityId]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`https://volunteersphere.onrender.com/api/userApproval/approve/${id}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        console.error('Error approving user:', response.statusText);
        return;
      }

      const data = await response.json();

      // Update signups state
      setSignups((prevSignups) =>
        prevSignups.map((signup) => signup._id === id ? { ...signup, status: 'approved', certificateUrl: data.certificateUrl } : signup)
      );
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch(`https://volunteersphere.onrender.com/api/userApproval/decline/${id}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        console.error('Error declining user:', response.statusText);
        return;
      }

      // Update signups state
      setSignups((prevSignups) =>
        prevSignups.map((signup) => signup._id === id ? { ...signup, status: 'declined' } : signup)
      );
    } catch (error) {
      console.error('Error declining user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approve or Decline Sign-Ups</Text>
      <FlatList
        data={signups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.signupItem}>
            <Text style={styles.signupName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.signupStatus}>Status: {item.status}</Text>
            {item.status === 'approved' && item.certificateUrl && (
              <Text style={styles.certificateLink} onPress={() => Linking.openURL(item.certificateUrl)}>
                View Certificate
              </Text>
            )}
            {item.status === 'pending' && (
              <View style={styles.buttonGroup}>
                <Button title="Approve" onPress={() => handleApprove(item._id)} />
                <Button title="Decline" onPress={() => handleDecline(item._id)} />
              </View>
            )}
          </View>
        )}
      />
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  signupName: {
    fontSize: 16,
  },
  signupStatus: {
    fontSize: 14,
    color: 'grey',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  certificateLink: {
    fontSize: 14,
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default ApproveSignUps;
