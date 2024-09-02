// CertificatesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const CertificatesScreen = ({ route }) => {
  const { studentId } = route.params; // Get the studentId from route params
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`https://volunteersphere.onrender.com/api/certificates/${studentId}`);
        if (!response.ok) {
          throw new Error('Error fetching certificates');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        Alert.alert('Error', 'Failed to load certificates');
      }
    };

    fetchCertificates();
  }, [studentId]);

  // Function to handle viewing the certificate
  const handleViewCertificate = (certificatePath) => {
    // Here you can implement the logic to view or download the certificate
    Alert.alert('View Certificate', `Opening certificate at ${certificatePath}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Certificates</Text>
      {certificates.length === 0 ? (
        <Text>No certificates available.</Text>
      ) : (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.certificateItem}>
              <Text style={styles.certificateText}>Activity: {item.activityId.name}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewCertificate(item.certificatePath)}
              >
                <Text style={styles.buttonText}>View Certificate</Text>
              </TouchableOpacity>
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
  certificateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certificateText: {
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CertificatesScreen;
