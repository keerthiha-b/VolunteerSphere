import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const CertificatesScreen = ({ route }) => {
  const { studentId } = route.params;
  const [certificates, setCertificates] = useState([]);

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

  const renderCertificate = ({ item }) => (
    <View style={styles.certificateContainer}>
      <Text style={styles.certificateTitle}>Certificate of Completion</Text>
      <Text style={styles.certificateText}>This certifies that</Text>
      <Text style={styles.certificateName}>{item.certificateDetails.studentName}</Text>
      <Text style={styles.certificateText}>has successfully completed the activity</Text>
      <Text style={styles.certificateActivity}>"{item.certificateDetails.activityName}"</Text>
      <Text style={styles.certificateText}>and spent {item.certificateDetails.hoursSpent} contributing to this cause.</Text>
      <Text style={styles.certificateFooter}>We appreciate your efforts and dedication.</Text>
      <Text style={styles.certificateSignature}>Signed by, VolunteerSphere Organization</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Certificates</Text>
      {certificates.length > 0 ? (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item._id}
          renderItem={renderCertificate}
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
  certificateContainer: {
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.2, // Adds shadow for iOS
    shadowRadius: 5, // Adds shadow for iOS
  },
  certificateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  certificateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  certificateName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  certificateActivity: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  certificateFooter: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  certificateSignature: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default CertificatesScreen;
