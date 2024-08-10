import React, { useEffect, useState } from 'react';
import { View, Alert, Button, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { save, getValueFor } from './utils/secureStoreUtil'; 
import axios from 'axios';
import { format, parseISO, add } from 'date-fns';

// Import the images
import volunteer from '../assets/volunteer.png';
import volunteer1 from '../assets/volunteer1.png';
import volunteer2 from '../assets/volunteer2.png';

// Array of imported images
const images = [volunteer, volunteer1, volunteer2];

const formatDuration = async (durationStr) => {
  const [hours, minutes] = durationStr.split(' ').map(part => parseInt(part));
  return { hours: hours || 0, minutes: minutes || 0 };
};

const extractImportantAddress = (address) => {
  // Split the address into parts
  const parts = address.split(',').map(part => part.trim());

  // Assuming the important parts are the name and the city
  const name = parts[0]; // e.g., "University of Toronto Scarborough"

  return `${name}`;
};

const SignUpVolunteerOpportunity = ({ navigation, route }) => {
  const { opportunity } = route.params;
  const { date, duration } = opportunity;
  const importantAddress = extractImportantAddress(opportunity.address);

  // Parse start date and time
  const startDate = parseISO(date);
  
  // Calculate end time
  const { hours, minutes } = formatDuration(duration);
  const endDate = add(startDate, { hours, minutes });

  // Format date and time
  const formattedStartTime = format(startDate, 'hh:mmaaaa'); // e.g., "11:08am"
  const formattedEndTime = format(endDate, 'hh:mmaaaa'); // e.g., "12:38pm"
  const formattedDate = format(startDate, 'MMMM dd, yyyy'); // e.g., "February 09, 2024"

  const attemptSignUpOpportunity = async () => {
    const userId = await getValueFor("userId");

    const body = {
        userId: userId,
        opportunityId: opportunity._id
    }

    console.log(body);

    try {
      const response = await fetch('https://volunteersphere.onrender.com/sign-up-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Received data:', data); // Log the received data

      if (response.ok) {
        Alert.alert("Successfully signed up for opportunity " + opportunity.name, data.errorMsg);

       
      } else {
        console.error('Sign up opportunity Error:', data.errorMsg);
        Alert.alert("Sign up opportunity failed", data.errorMsg);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  const attemptRemoveSignedUpOpportunity = async () => {
    const userId = await getValueFor("userId");

    const body = {
        userId: userId,
        opportunityId: opportunity._id
    }

    console.log(body);

    try {
      const response = await fetch('https://volunteersphere.onrender.com/remove-signed-up-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Received data:', data); // Log the received data

      if (response.ok) {
        Alert.alert("Successfully removed sign up for opportunity " + opportunity.name, data.errorMsg);

       
      } else {
        console.error('Removing sign up opportunity Error:', data.errorMsg);
        Alert.alert("Removing sign up opportunity failed", data.errorMsg);
      }
    } catch (error) {
      console.error('Network Error:', error);
      console.error('Error stack trace:', error.stack);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
      <View style={styles.container}>
          <Image source={randomImage} style={styles.image} />
          <View style={styles.subcontainer}>
            <Text style={[styles.title, styles.text]}>{opportunity.name}</Text>
            <Text style={[styles.org, styles.text]}>{opportunity.userId.organization_name}</Text>
            <Text style={[styles.dur_pts, styles.text]}>{opportunity.duration} of volunteering • [NUM POINTS: TBD]</Text>
            <Text style={[styles.deets, styles.text]}>⚙️   {formattedStartTime} - {formattedEndTime} • {formattedDate}</Text>
            <Text style={[styles.deets,styles.text]}>⚙️   {importantAddress}</Text>
            <Text style={[styles.deets, styles.text]}>⚙️   {opportunity.phoneNumber}</Text>
            <Text style={[styles.deets, styles.text]}>About</Text>
            <Text style={[styles.deets, styles.text]}>Photos and Videos</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={attemptSignUpOpportunity}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={attemptRemoveSignedUpOpportunity}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subcontainer: {
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 8
  },
  text: {
    color: '#6D4731',
  },
  title: {
    fontWeight: '500',
    fontSize: 25,
  },
  org: {
    fontWeight: '400',
    fontSize: 18
  },
  dur_pts: {
    fontWeight: '400',
    fontSize: 13
  },
  deets: {
    fontWeight: '500',
    fontSize: 16,
    paddingTop: 10
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FA7F35'
  },
  buttonText: {
    fontWeight: '500',
    color: '#ffff',
    fontSize: 25
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    padding: 30
  }
});

export default SignUpVolunteerOpportunity;