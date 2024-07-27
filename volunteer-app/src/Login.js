import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { save, getValueFor } from './utils/secureStoreUtil'; // Adjust the path as needed

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const attemptLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Username and password cannot be empty.");
      return;
    }

    try {
      const response = await fetch('https://volunteersphere.onrender.com/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        console.log("logged in email" + data.email);

        save("name", `${data.first_name} ${data.last_name}`);
        console.log("value for name: " + getValueFor("name"));
        save("email", data.email);
        console.log("value for email: " + getValueFor("email"));

        // Check user type and navigate accordingly
        if (data.userType === 'organization') {
          navigation.navigate('LandingPageOrg'); // Navigate to the organization landing page
        } else if (data.userType === 'user') {
          navigation.navigate('StudentLandingPage'); // Navigate to the student landing page
        } else {
          Alert.alert("Login Error", "Unknown user type.");
        }
      } else {
        console.error('Login Error:', data.errorMsg);
        Alert.alert("Login Failed", data.errorMsg);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Log In"
        color="#FA7F35" // Dark orange color
        onPress={attemptLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  }
});

export default LoginScreen;
