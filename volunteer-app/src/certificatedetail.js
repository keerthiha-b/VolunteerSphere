import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CertificateDetailScreen = ({ route }) => {
  const { certificate } = route.params;

  return (
    <View style={styles.certificateContainer}>
      <View style={styles.certificateBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>CERTIFICATE OF COMPLETION</Text>
        </View>
        <Text style={styles.bodyText}>This certificate is awarded to</Text>
        <Text style={styles.name}>{certificate.certificateDetails.studentName}</Text>
        <Text style={styles.bodyText}>For completing</Text>
        <Text style={styles.activity}>{certificate.certificateDetails.activityName}</Text>
        <Text style={styles.certificateFooter}>We appreciate your efforts and dedication.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  certificateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  certificateBox: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#004445',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    backgroundColor: '#004445',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginVertical: 10,
  },
  activity: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#000000',
    alignItems: 'center',
  },
  signature: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CertificateDetailScreen;
