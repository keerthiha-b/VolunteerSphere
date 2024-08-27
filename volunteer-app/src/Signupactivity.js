import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Signupactivity = ({ route, navigation }) => {
  const { activityName, date, time } = route.params;

  if (!activityName || !date || !time) {
    return <Text>Error: Missing activity details</Text>; // Handle this scenario appropriately
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.message}>
        You have successfully signed up for:
      </Text>
      <Text style={styles.activityName}>{activityName}</Text>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>
          <Text style={styles.icon}>🗓️</Text> Date: {date}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.icon}>⏰</Text> Time: {time}
        </Text>
      </View>

      <Text style={styles.reminder}>
        Please make sure to come on time.
      </Text>

      {/* Back to Home Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('StudentLandingPage')} // Adjust as per your navigation needs
          color="#228B22" // Customize the button color
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8', // Light grey background for the entire screen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#228B22', // Forest green
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#555', // Darker grey for better contrast
  },
  activityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500', // Orange red
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#ffffff', // White background for details
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333', // Dark grey text color
  },
  icon: {
    fontSize: 18,
    marginRight: 5,
  },
  reminder: {
    fontSize: 16,
    color: '#FF4500', // Orange red
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 40,
  },
});

export default Signupactivity;
