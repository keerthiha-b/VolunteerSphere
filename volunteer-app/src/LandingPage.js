
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Volunteer Sphere</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {
        console.log("Navigation object:", navigation);
        navigation.navigate('SignUp');}}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8B187',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FA7F35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600'
  }
});

export default LandingPage;
