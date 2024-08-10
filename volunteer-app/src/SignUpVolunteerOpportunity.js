import React, { useEffect, useState } from 'react';
import { View, Alert, Button, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { save, getValueFor } from './utils/secureStoreUtil'; 
import axios from 'axios';

const SignUpVolunteerOpportunity = ({ navigation, route }) => {
  const { opportunity } = route.params;

  const attemptSignUpOpportunity = async () => {
    const userId = await getValueFor("userId");

    const body = {
        userId: userId,
        opportunityId: opportunity._id
    }

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
        Alert.alert("Successfully removed from opportunity " + opportunity.name, data.errorMsg);

       
      } else {
        console.error('Sign up opportunity Error:', data.errorMsg);
        Alert.alert("Sign up opportunity failed", data.errorMsg);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  return (
      <ScrollView style={styles.container}>
          <Text>
              { opportunity._id }
          </Text>
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