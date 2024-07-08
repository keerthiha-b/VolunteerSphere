import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const attemptLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Username and password cannot be empty.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        console.log(data.email);
        navigation.navigate('OrgLandingPage', {org_name:username}); // Navigate to the next screen
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
