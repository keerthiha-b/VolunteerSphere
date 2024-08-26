import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SuccessScreen = ({ route, navigation }) => {
  const { activityName, date, time } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.message}>
        You have successfully signed up for {activityName}.
      </Text>
      <Text style={styles.details}>
        Date: {date}
      </Text>
      <Text style={styles.details}>
        Time: {time}
      </Text>
      <Text style={styles.reminder}>
        Please make sure to come on time.
      </Text>
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('StudentLandingPage')} // Adjust as per your navigation needs
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22', // Forest green
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  reminder: {
    fontSize: 14,
    color: '#FF4500', // Orange red
    marginTop: 20,
    textAlign: 'center',
  },
});

export default SuccessScreen;
