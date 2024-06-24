import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Import the images
import volunteer from '../assets/volunteer.png';
import volunteer1 from '../assets/volunteer1.png';
import volunteer2 from '../assets/volunteer2.png';

// Array of imported images
const images = [volunteer, volunteer1, volunteer2];

const EachPosting= ({ opportunity }) => {
  // Select a random image
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <View style={styles.card}>
      <Image source={randomImage} style={styles.image} />
      <Text style={styles.title}>{opportunity.name}</Text>
      <Text style={styles.details}>{opportunity.duration} of volunteering</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Sign-Ups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Text>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#ffcba4' ,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  editButton: {
    marginLeft: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    marginLeft: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
  }
});

export default EachPosting;
