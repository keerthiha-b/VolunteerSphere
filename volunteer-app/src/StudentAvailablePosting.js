import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

// Import the images
import volunteer from '../assets/volunteer.png';
import volunteer1 from '../assets/volunteer1.png';
import volunteer2 from '../assets/volunteer2.png';

// Array of imported images
const images = [volunteer, volunteer1, volunteer2];

const EachPosting= ({ opportunity, navigation }) => {
  // Select a random image
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('SignUpVolunteerOpportunity', {opportunity})}
    >
      <Image source={randomImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  details: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10
  },
});

export default EachPosting;
