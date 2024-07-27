import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { save } from './utils/secureStoreUtil'; // Import save function from secureStoreUtil

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isOrg, setIsOrg] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [matchError, setMatchError] = useState('');

  const sendSignUpToBackend = async () => {
    if (!validatePasswordAndEmail(password, email) || !confirmMatch()) {
      return; // Prevent submission if errors exist
    }

    const userType = isOrg ? 'org' : 'user';

    const newUser = {
      userType,
      username,
      password,
      email,
      ...(isOrg ? { orgName } : { firstName, lastName })
    };

    try {
      const response = await fetch('https://volunteersphere.onrender.com/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      // Ensure the response is properly handled
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json(); // Attempt to parse JSON response
        console.log('Received data:', data); // Log the received data

        if (response.ok) {
          console.log('User/Organization created successfully');
          await save("userType", userType); // Save userType
          navigation.navigate('Success'); // Navigate on success
        } else {
          console.error('Error adding user/organization:', data.errorMsg);
          Alert.alert("Registration Failed", data.errorMsg);
        }
      } else {
        const errorText = await response.text(); // Read the text error response
        console.error(`Non-JSON response: ${errorText}`); // Handle non-JSON response
        Alert.alert("Server Error", `Received a non-JSON response from the server: ${errorText}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  const validatePasswordAndEmail = (currentPassword, currentEmail) => {
    let errors = [];

    if (currentEmail === '') {
      errors.push('Email is required');
    }
    if (isOrg && orgName === '') {
      errors.push('Organization name is required');
    }
    if (!isOrg && firstName === '') {
      errors.push('Your first name is required');
    }
    if (!isOrg && lastName === '') {
      errors.push('Your last name is required');
    }
    if (username === '') {
      errors.push('Username is required');
    }
    if (currentPassword === '') {
      errors.push('Password is required');
    } else {
      if (currentPassword.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(currentPassword)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(currentPassword)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(currentPassword)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[$%&#]/.test(currentPassword)) {
        errors.push('Password must contain at least one special character (one of $ % & #)');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  const confirmMatch = () => {
    if (password !== confirmPassword) {
      setMatchError('Passwords do not match');
      return false;
    } else {
      setMatchError('');
      return true;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.switchContainer}>
        <Text>Toggle on for signing up as an organization</Text>
        <Switch
          value={isOrg}
          onValueChange={newVal => setIsOrg(newVal)}
        />
      </View>
      {isOrg && (
        <TextInput
          style={styles.input}
          placeholder="Organization Name"
          value={orgName}
          onChangeText={setOrgName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(e) => {
          setEmail(e);
          validatePasswordAndEmail(password, e);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(e) => {
          setPassword(e);
          validatePasswordAndEmail(e, email);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {!isOrg && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}
      {validationErrors.length > 0 && (
        <View style={styles.errorContainer}>
          {validationErrors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}
      {matchError !== '' && (
        <Text style={styles.errorText}>{matchError}</Text>
      )}
      <Button
        title="Sign Up"
        color="#FA7F35"
        onPress={sendSignUpToBackend}
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
  },
  errorContainer: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    color: '#721c24',
    textAlign: 'center',
    fontSize: 14,
  }
});

export default SignUpScreen;
