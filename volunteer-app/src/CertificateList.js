import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const CertificatesScreen = ({ route }) => {
  const { studentId } = route.params;
  const [certificates, setCertificates] = useState([]);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Fetch all certificates for the student
        const response = await fetch(`https://volunteersphere.onrender.com/api/generate-certificate/student/${studentId}`);
        
        if (!response.ok) {
          console.error('Server error:', response.status, response.statusText);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error.message || error);
        Alert.alert('Error', 'Failed to load certificates.');
      }
    };

    fetchCertificates();
  }, [studentId]);

  const handleViewCertificate = (certificate) => {
    // Navigate to the CertificateDetailScreen with the selected certificate
    navigation.navigate('CertificateDetailScreen', { certificate });
  };

  const renderCertificateItem = ({ item }) => (
    <View style={styles.certificateItem}>
      <Text style={styles.activityName}>Activity: {item.certificateDetails.activityName}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewCertificate(item)}
      >
        <Text style={styles.buttonText}>View Certificate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Certificates</Text>
      {certificates.length > 0 ? (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item._id}
          renderItem={renderCertificateItem}
        />
      ) : (
        <Text>No certificates available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  activityName: {
    fontSize: 16,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default CertificatesScreen;
