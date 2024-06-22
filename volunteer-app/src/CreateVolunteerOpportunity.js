import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AddressAutocomplete from './AddressAutocomplete';

const CreateVolunteerOpportunity = () => {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

    if (!description) {
      Alert.alert('Error', 'Please provide a description of the volunteer opportunity.');
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

    const activity = {
      name,
      date: date.toISOString(),
      duration,
      address,
      description,
      phoneNumber,
    };

    try {
      console.log('Submitting activity:', activity);
      const response = await axios.post('http://localhost:3001/activities', activity);
      console.log('Response:', response);
      if (response.status === 200) {
        Alert.alert('Success', 'Activity submitted successfully!');
        setName('');
        setMonth(null);
        setDay(null);
        setHour(null);
        setMinute(null);
        setDuration('');
        setAddress('');
        setDescription('');
        setPhoneNumber('');
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
      <Text style={styles.header}>Create a New Volunteer Opportunity</Text>

      <Text style={styles.label}>Provide the name of your volunteer opportunity*</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Provide the date and start time of this task*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setMonth(value)}
          items={months}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setDay(value)}
          items={days}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setHour(value)}
          items={hours}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setMinute(value)}
          items={minutes}
        />
      </View>

      <Text style={styles.label}>Provide the time duration of this task*</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="e.g., 1 hr 30 min" />

      <Text style={styles.label}>Provide the exact address of this opportunity*</Text>
      <AddressAutocomplete address={address} setAddress={setAddress} />

      <Text style={styles.label}>Provide a description of the volunteer opportunity*</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Provide a contact phone number*</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="555-555-5555" />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: 80,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: 80,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default CreateVolunteerOpportunity;
