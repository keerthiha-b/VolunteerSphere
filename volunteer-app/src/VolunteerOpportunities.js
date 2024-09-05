import React, { useState, useEffect } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';
import EachPosting from './EachPosting';  
import { getValueFor } from './utils/secureStoreUtil';

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userType = await getValueFor('userType');
        const organizationId = await getValueFor('userId'); 
        
        let response;
        if (userType === 'org') {
          response = await axios.get(`https://volunteersphere.onrender.com/activities/${organizationId}`);
        } else {
          response = await axios.get('https://volunteersphere.onrender.com/activities');
        }
        
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

    // Function to remove the deleted opportunity from the list
    const removeOpportunity = (id) => {
      setOpportunities((prevOpportunities) =>
        prevOpportunities.filter((opportunity) => opportunity._id !== id)
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={opportunities}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <EachPosting 
              opportunity={item} 
              onDelete={() => removeOpportunity(item._id)} // Pass the removeOpportunity function to EachPosting
            />
          )}
        />
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#f0f0f0',  
  }
});

export default VolunteerOpportunities;