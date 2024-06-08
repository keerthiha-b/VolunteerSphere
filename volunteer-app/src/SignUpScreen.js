import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch } from 'react-native';

const SignUpScreen = () => {
  const [isOrg, setIsOrg] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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
          onChangeText={setOrgName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter a username for this account"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a password for this account"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {!isOrg && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Provide a first and last name"
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
      <Button
        title="Sign Up"
        onPress={() => console.log("Sign Up Pressed")} // Here you will later add the function to handle the Firebase signup
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
