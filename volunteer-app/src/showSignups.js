import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const SignUpsScreen = ({ route }) => {
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
      }
    };

    fetchSignups();
  }, [activityId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participants</Text>
      {signups.length === 0 ? (
        <Text>No signups for this activity.</Text>
      ) : (
        <FlatList
          data={signups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.signupItem}>
              <Text style={styles.signupName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.signupStatus}>Status: {item.status}</Text>
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
});

export default SignUpsScreen;
