import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const StudentLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Landing Page</Text>
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate('MapPage')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default StudentLandingPage;
