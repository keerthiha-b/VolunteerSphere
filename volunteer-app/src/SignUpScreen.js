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
      orgName: isOrg ? orgName : undefined,
      username,
      password,
      firstName: isOrg ? undefined : firstName,
      lastName: isOrg ? undefined : lastName,
      email
    };

    try {
      const response = await fetch('https://volunteersphere.onrender.com/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        console.log('User/Organization created successfully');
        await save("userType", userType); // Save userType
        navigation.navigate('Success'); // Navigate on success
      } else {
        const data = await response.json();
        console.error('Error adding user/organization:', data.errorMsg);
        Alert.alert("Registration Failed", data.errorMsg);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert("Network Error", "Unable to connect. Please try again later.");
    }
  }

  // (The rest of the component remains the same)

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
