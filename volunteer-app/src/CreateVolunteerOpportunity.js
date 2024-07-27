import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AddressAutocomplete from './AddressAutocomplete';
import { getValueFor } from './utils/secureStoreUtil'; // Import the secure store utility

const CreateVolunteerOpportunity = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const categories = [
    { label: 'Environment', value: 'Environment' },
    { label: 'Education', value: 'Education' },
    { label: 'Health', value: 'Health' },
    { label: 'Community Service', value: 'Community Service' },
    { label: 'Animal Welfare', value: 'Animal Welfare' },
  ];

  const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));

  const hours = Array.from({ length: 24 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));

  const durations = [
    { label: '1 hr', value: '1 hr' },
    { label: '1 hr 30 min', value: '1 hr 30 min' },
    { label: '2 hr', value: '2 hr' },
  ];

  const validateFields = () => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;

    if (!name) {
      Alert.alert('Error', 'Please provide the name of the volunteer opportunity.');
      return false;
    }

    if (month === null) {
      Alert.alert('Error', 'Please provide the month of the task.');
      return false;
    }

    if (day === null) {
      Alert.alert('Error', 'Please provide the day of the task.');
      return false;
    }

    if (hour === null) {
      Alert.alert('Error', 'Please provide the hour of the task.');
      return false;
    }

    if (minute === null) {
      Alert.alert('Error', 'Please provide the minute of the task.');
      return false;
    }

    if (!duration) {
      Alert.alert('Error', 'Please provide the duration of the task.');
      return false;
    }

    if (!address) {
      Alert.alert('Error', 'Please provide the exact address of the opportunity.');
      return false;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category for the opportunity.');
      return false;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Please provide a contact phone number.');
      return false;
    }

    if (!phonePattern.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be in the format 555-555-5555.');
      return false;
    }

    return true;
  };

  const verifyAddress = async (address) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&countrycodes=ca&format=json&addressdetails=1&limit=1`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Error verifying address:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const isAddressValid = await verifyAddress(address);
    if (!isAddressValid) {
      Alert.alert('Error', 'The provided address does not exist. Please enter a valid address.');
      return;
    }

    const date = new Date();
    date.setMonth(month);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);

    const userId = await getValueFor('userId'); // Retrieve userId from secure store
    const userType = 'org'; // Retrieve userType from secure store

    if (!userId || !userType) {
      Alert.alert('Error', 'User ID or User Type is missing. Please log in again.');
      return;
    }

    const activity = {
      name,
      date: date.toISOString(),
      duration,
      address,
      category,
      phoneNumber,
      userId, // Include userId
      userType, // Include userType
    };

    try {
      console.log('Submitting activity:', activity);
      const response = await axios.post('https://volunteersphere.onrender.com/activities', activity);
      console.log('Response:', response);
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Activity submitted successfully!');
        // Clear form
        setName('');
        setMonth('');
        setDay('');
        setHour('');
        setMinute('');
        setDuration('');
        setAddress('');
        setCategory('');
        setPhoneNumber('');
        navigation.navigate('VolunteerOpportunities');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create a New Volunteer Opportunity</Text>
      </View>

      <Text style={styles.label}>Provide the name of your volunteer opportunity*</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Provide the date and start time of this task*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setMonth(value)}
          items={months}
          placeholder={{ label: 'Select month', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
        <RNPickerSelect
          onValueChange={(value) => setDay(value)}
          items={days}
          placeholder={{ label: 'Select day', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
        <RNPickerSelect
          onValueChange={(value) => setHour(value)}
          items={hours}
          placeholder={{ label: 'Select hour', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
        <RNPickerSelect
          onValueChange={(value) => setMinute(value)}
          items={minutes}
          placeholder={{ label: 'Select minute', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.label}>Provide the time duration of this task*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setDuration(value)}
          items={durations}
          placeholder={{ label: 'Select duration', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.label}>Provide the exact address of this opportunity*</Text>
      <AddressAutocomplete address={address} setAddress={setAddress} />

      <TouchableOpacity style={styles.searchButton} onPress={() => verifyAddress(address)}>
      </TouchableOpacity>

      <Text style={styles.label}>Select a category for the volunteer opportunity*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={categories}
          placeholder={{ label: 'Select category', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.label}>Provide a contact phone number*</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="555-555-5555" />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FA7F35',
    padding: 15,
    borderRadius: 0,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#fff',
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#6D4731',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FA7F35',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    color: 'gray',
  },
};

export default CreateVolunteerOpportunity;
