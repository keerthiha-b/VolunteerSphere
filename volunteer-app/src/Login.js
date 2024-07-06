import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const attemptLogin = async () => {
    const currUser = {
      username: username,
      password: password
    };

    try {
      const response = await fetch('http://localhost:3001/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currUser)
      });

      if (response.ok) {
        console.log('Logged in successfully');
        navigation.navigate('Home')
      } else {
        console.error('Error adding object');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Log In </Text>
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
        onPress={attemptLogin} // Here you will later add the function to handle the Firebase signup
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffcba4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  }
});

export default SignUpScreen;
