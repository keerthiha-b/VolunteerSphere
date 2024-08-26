import React, { useState, useEffect } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';
import EachPosting from './EachPosting';  // Child component to render each item

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/activities')
      .then(response => {
        setOpportunities(response.data);
      })
      .catch(error => console.error('Error fetching activities:', error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => <EachPosting opportunity={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#f0f0f0',  // Adjust background color to match your theme
  }
});

export default VolunteerOpportunities;