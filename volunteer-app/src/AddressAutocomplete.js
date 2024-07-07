import React, { useState } from 'react';
import { View, TextInput, Button, Modal, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const AddressAutocomplete = ({ address, setAddress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=ca&format=json&addressdetails=1&limit=5`);
      setSuggestions(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleSelectAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setQuery(selectedAddress);
    setSuggestions([]);
    setModalVisible(false);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter address"
      />
      <Button title="Search" onPress={() => fetchSuggestions(query)} />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectAddress(item.display_name)}
                  >
                    <Text style={styles.suggestion}>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noSuggestions}>Address does not exist</Text>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
  },
  noSuggestions: {
    padding: 20,
    textAlign: 'center',
  },
});

export default AddressAutocomplete;
