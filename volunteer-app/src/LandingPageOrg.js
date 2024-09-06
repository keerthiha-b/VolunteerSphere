import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getValueFor, remove } from './utils/secureStoreUtil'; // Adjust the path as needed

const OrgLandingPage = ({ navigation }) => {
  const org_name = getValueFor("name");

  const logOut = async () => {
    await remove('name');
    await remove('email');
    await remove('userType');
    await remove('userId');
    navigation.navigate('LandingPage');
  }

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.profileGear}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { org_name })}>
          <Text style={styles.gearText}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logOut()}>
          <Text style={styles.gearText}>⬅️</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.greeting}>Welcome back, {org_name || 'Organization'} </Text>
      
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
            <Text style={styles.optionButtonText}>Reviews on Postings</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    top:-80,
    justifyContent: 'space-between',
    width: '20%',
    marginBottom: 5,
  },
  gearText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    top:-40,
  },
  image: {
    width: '100%', // Full width of the container
    height: 200, // Set the desired height
    top:-30,
    marginBottom: 20, // Space between the image and the next section
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    top:-40,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    top:-30,
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
