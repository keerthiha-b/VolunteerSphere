import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { save, getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed

const OrgLandingPage = ({ navigation }) => {
  console.log(getValueFor("name"));
  const org_name = getValueFor("name");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { org_name })}>
        <Text style={styles.gearText}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.greeting}>Welcome back, {org_name} </Text>
      
      {/* Image added here */}
      <Image 
        source={require('./images/orgdash.jpg')} // Replace with your image URL or local file path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>What would you like to do?</Text>

      <View style={styles.optionsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('CreateVolunteerOpportunity')}>
            <Text style={styles.optionButtonText}>Create a New Volunteer Opportunity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('VolunteerOpportunities')}>
            <Text style={styles.optionButtonText}>Manage Volunteer Opportunities</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.centeredRow}>
          <TouchableOpacity style={styles.centeredOptionButton} onPress={() => navigation.navigate('Comments')}>
            <Text style={styles.optionButtonText}>Review Comments on Past Postings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>What would you like to do?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('CreateVolunteerOpportunity')}>
          <Text style={styles.optionButtonText}>Create a New Volunteer Opportunity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('VolunteerOpportunities')}>
          <Text style={styles.optionButtonText}>Manage Volunteer Opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Review Comments on Past Postings</Text>
        </TouchableOpacity>

        {/* New button for "Approve certificates" */}
        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => navigation.navigate('PastActivities', { activityId: '66d78bc05c2ec9cd682a5119' })}  // Ensure this screen exists in your navigation stack
        >
          <Text style={styles.optionButtonText}>Approve certificates</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffff',
  },
  profileGear: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  gearText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%', // Full width of the container
    height: 200, // Set the desired height
    marginBottom: 20, // Space between the image and the next section
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#FA7F35',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 100,
  },
  centeredRow: {
    alignItems: 'center',
    width: '100%',
  },
  centeredOptionButton: {
    backgroundColor: '#FA7F35',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%', // Adjust this width to center the button properly
    height: 100,
  },
  optionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OrgLandingPage;
