import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed

const OrgLandingPage = ({ navigation }) => {
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const storedOrgName = await getValueFor('name');
        const storedOrgId = await getValueFor('orgId');
        setOrgName(storedOrgName);
        setOrgId(storedOrgId);
      } catch (error) {
        Alert.alert('Alert', error.message);
      }
    };

    fetchOrgDetails();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileGear} onPress={() => navigation.navigate('Profile', { orgName })}>
        <Text style={styles.gearText}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.greeting}>Welcome back, {orgName}</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('CreateVolunteerOpportunity')}>
          <Text style={styles.optionButtonText}>Create a New Volunteer Opportunity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('VolunteerOpportunities')}>
          <Text style={styles.optionButtonText}>Manage Volunteer Opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('AdminPastActivitiesScreen', { orgId })}
        >
          <Text style={styles.optionButtonText}>Review Comments on Past Postings</Text>
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  optionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OrgLandingPage;
