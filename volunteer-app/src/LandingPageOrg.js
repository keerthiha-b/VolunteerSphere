import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrgLandingPage = ({ navigation, route }) => {

  const { org_name } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { org_name })}>
            <Text>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.greeting}>Welcome back, { org_name } </Text>
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
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffcba4',
  },
  profileGear: {
    marginBottom: 10,
    alignItems: 'left',
    justifyContent: 'left',
    fontSize: 30,
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
