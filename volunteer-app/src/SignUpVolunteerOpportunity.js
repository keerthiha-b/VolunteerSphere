import React, { useEffect, useState } from 'react';
import { View, Alert, Button, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { save, getValueFor } from './utils/secureStoreUtil'; 
import axios from 'axios';
import { format, parseISO, add } from 'date-fns';
import { parseDuration } from 'date-fns/locale';

const SignUpVolunteerOpportunity = ({ navigation, route }) => {
  const { opportunity } = route.params;

  const { date, duration } = opportunity;

  // Parse start date and time
  const startDate = parseISO(date);
  
  // Calculate end time
  const { hours, minutes } = formatDuration(duration);
  const endDate = add(startDate, { hours, minutes });

  // Format date and time
  const formattedStartTime = format(startDate, 'hh:mmaaaa'); // e.g., "11:08am"
  const formattedEndTime = format(endDate, 'hh:mmaaaa'); // e.g., "12:38pm"
  const formattedDate = format(startDate, 'MMMM dd, yyyy'); // e.g., "February 09, 2024"
  
  const formatDuration = (durationStr) => {
    const [hours, minutes] = durationStr.split(' ').map(part => parseInt(part));
    return { hours: hours || 0, minutes: minutes || 0 };
  };

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

  return (
      <ScrollView style={styles.container}>
          <Text>{opportunity.name}</Text>
          <Text>{opportunity.userId.organization_name}</Text>
          <Text>{opportunity.duration}</Text>
          <Text>[NUM POINTS: CURRENTLY DON'T HAVE THIS ASSIGNED]</Text>
          <Text>{opportunity.date}</Text>
          <Button
            title="Sign up"
            color="#FA7F35"
            onPress={attemptSignUpOpportunity}
          />
          <Button
            title="Remove"
            color="#FA7F35"
            onPress={attemptRemoveSignedUpOpportunity}
          />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
    }
});

export default SignUpVolunteerOpportunity;