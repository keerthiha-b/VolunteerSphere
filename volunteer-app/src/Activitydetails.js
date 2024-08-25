import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Import images for each category
const images = {
  health: require('./images/Health.jpg'),
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
  // Add more categories and corresponding images as needed
};

const ActivityDetailScreen = ({ route }) => {
  const { activity } = route.params;

  // Determine the image based on the category
  const activityImage = images[activity.category.toLowerCase()] || images['default'];

  return (
    <View style={styles.container}>
      <Image source={activityImage} style={styles.image} />
      <Text style={styles.title}>{activity.name}</Text>
      <Text>Category: {activity.category}</Text>
      <Text>Duration: {activity.duration}</Text>
      <Text>Date: {activity.date}</Text>
      <Text>Address: {activity.address}</Text>
      {/* Add more fields as necessary */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  // Add more styles as needed
});

export default ActivityDetailScreen;
