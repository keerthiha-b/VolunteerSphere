import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrgLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome back</Text>
      
      <Text style={styles.title}>What would you like to do?</Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('CreateVolunteerOpportunity')}>
        <Text style={styles.buttonText}>Create a New Volunteer Opportunity</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('VolunteerOpportunities')}>
        <Text style={styles.buttonText}>Manage Volunteer Opportunity(s)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.buttonText}>Review Comments on Past Postings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffcba4',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notification: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f2994a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default OrgLandingPage;
