import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const CertificatesScreen = ({ route }) => {
  const { studentId } = route.params;
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificateHtml, setSelectedCertificateHtml] = useState(null);

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

  const handleViewCertificate = async (signupId) => {
    try {
      const response = await fetch(`https://volunteersphere.onrender.com/api/generate-certificate/html/${signupId}`);

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const htmlContent = await response.text();
      setSelectedCertificateHtml(htmlContent);
    } catch (error) {
      console.error('Error fetching certificate HTML:', error.message || error);
      Alert.alert('Error', 'Failed to load certificate.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Certificates</Text>
      {selectedCertificateHtml ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: selectedCertificateHtml }}
          style={styles.webview}
        />
      ) : (
        <FlatList
          data={certificates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.certificateItem}>
              <Text>Activity: {item.activityId.name}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewCertificate(item._id)}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default CertificatesScreen;
