import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CertificateDetailScreen = ({ route }) => {
  const { certificate } = route.params;

  return (
    <View style={styles.certificateContainer}>
      <Text style={styles.certificateTitle}>Certificate of Completion</Text>
      <Text style={styles.certificateText}>This certifies that</Text>
      <Text style={styles.certificateName}>{certificate.certificateDetails.studentName}</Text>
      <Text style={styles.certificateText}>has successfully completed the activity</Text>
      <Text style={styles.certificateActivity}>"{certificate.certificateDetails.activityName}"</Text>
      <Text style={styles.certificateText}>and spent {certificate.certificateDetails.hoursSpent} contributing to this cause.</Text>
      <Text style={styles.certificateFooter}>We appreciate your efforts and dedication.</Text>
      <Text style={styles.certificateSignature}>Signed by, VolunteerSphere Organization</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  certificateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
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

export default CertificateDetailScreen;
