import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch } from 'react-native';

const SignUpScreen = () => {
  const [isOrg, setIsOrg] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validationErrors, setValidationErrors] = useState(['Email is required', 'Your first name is required', 'Your last name is required', 'Username is required', 'Password is required']);
  const [matchError, setMatchError] = useState('');

  // For future reference:
  // password validation is done as the user is inputting information
  // matching error checking is done only when the user presses sign-up, and is removed once any textbox is changed afterwards 

  const sendSignUpToBackend = async () => {
    if(validationErrors.length > 0) {
      return;
    }

    confirmMatch();
    if(matchError != '') 
    {
      return;
    }

    const newUser = {
      isOrg: isOrg,
      orgName: orgName,
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email
    };

    console.log(JSON.stringify(newUser));

    try {
      const response = await fetch('http://localhost:3001/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        console.log('Object added successfully');
      } else {
        console.error('Error adding object');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const validatePasswordAndEmail = () => {
    var errors = [];

    // Validating email -> semantics changed later
    if(email == '')
    {
      errors.push('Email is required');
    }
    if(isOrg && orgName == '')
    {
      errors.push('Organization name is required');
    }
    if(!isOrg && firstName == '')
    {
      errors.push('Your first name is required');
    }
    if(!isOrg && lastName == '')
    {
      errors.push('Your last name is required');
    }
    if(username == '')
    {
      errors.push('Username is required');
    }
    if (password == '')
    {
      errors.push('Password is required');
    }
    else 
    {
      if(password.length <= 8) {
        errors.push('Password must be length of at least 8');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      } 
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      } 
      if (!/[$%&#]/.test(password)) {
        errors.push('Password must contain at least one special character (one of $ % & #)');
      }
    }

    setValidationErrors(errors);
    console.log(validationErrors);
    
    // Return if the number of errors is zero
    return errors.length === 0;
  }

  const confirmMatch = () => {
    if(password != confirmPassword) {
      setMatchError('Unable to sign up, passwords don\'t match');
    }
    else
    {
      setMatchError('');
    }
    console.log(matchError);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.switchContainer}>
        <Text>Are you representing an organization or facility?</Text>
        <Switch
          value={isOrg}
          onValueChange={newVal => setIsOrg(newVal)}
        />
      </View>
      {isOrg && (
        <TextInput
          style={styles.input}
          placeholder="What is the name of your organization or facility?"
          value={orgName}
          onChangeText={(e) => {
            setMatchError('');
            setOrgName(e)}}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter a username for this account"
        value={username}
        onChangeText={(e) => {
          setMatchError('');
          setUsername(e);
          validatePasswordAndEmail()}}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter an email"
        value={email}
        onChangeText={(e) => {
          setMatchError('');
          setEmail(e);
          validatePasswordAndEmail()}}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a password for this account"
        secureTextEntry
        value={password}
        onChangeText={(e) => {
          setMatchError('');
          setPassword(e);
          validatePasswordAndEmail()}}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(e) => {
          setMatchError('');
          setConfirmPassword(e);
          validatePasswordAndEmail()}}
      />
      {!isOrg && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Provide a first name"
            value={firstName}
            onChangeText={(e) => {
              setMatchError('');
              setFirstName(e);
              validatePasswordAndEmail()}}
          />
          <TextInput
            style={styles.input}
            placeholder="Provide a last Name"
            value={lastName}
            onChangeText={(e) => {
              setMatchError('');
              setLastName(e);
              validatePasswordAndEmail()}}
          />
        </>
      )}
      <Button
        title="Sign Up"
        onPress={sendSignUpToBackend} // Here you will later add the function to handle the Firebase signup
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
