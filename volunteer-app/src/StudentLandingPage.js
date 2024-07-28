import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getValueFor } from './utils/secureStoreUtil';
import axios from 'axios';
import Posting from './StudentAvailablePosting'; 

const StudentLandingPage = ({ navigation }) => {
  const [opportunities, setOpportunities] = useState([]);
  useEffect(() => {
      const getNearbyOpportunities = async () => {
          try {
              const userType = await getValueFor('userType');
              const organizationId = await getValueFor('userId'); // Assuming 'userId' is saved during login/signup
              
              let response;
              response = await axios.get('https://volunteersphere.onrender.com/activities');
              
              setOpportunities(response.data);
          } catch (error) {
          console.error('Error fetching activities:', error);
        }
      }
      getNearbyOpportunities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Landing Page</Text>
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate('MapPage')}
      />
      <Text style={styles.title}>Volunteer Opportunities</Text>
        <FlatList
            data={opportunities}
            keyExtractor={item => item._id.toString()} 
            renderItem={({ item }) => <Posting opportunity={item} navigation={navigation} />}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default StudentLandingPage;
