import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_API_KEY = 'AIzaSyAWO8MPlCpzIlQl7gd9d1Ur0rCqGAiWGx0'; // Replace with your actual API key

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for address search
  const [mapRegion, setMapRegion] = useState(null); // State to store the map region

  useEffect(() => {
    // Request user location
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error fetching user location:', error);
        Alert.alert('Error', 'Failed to fetch user location.');
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (searchQuery) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;
      console.log('Geocoding URL:', url); // Debugging log to check URL
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Geocoding API response:', data); // Log the full response for debugging

        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          setMapRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          Alert.alert('Location not found', 'Please try a different address.');
        }
      } catch (error) {
        console.error('Error fetching geocode data:', error);
        Alert.alert('Error', 'Network error occurred. Please check your internet connection and try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <>
          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Enter address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch} // Trigger handleSearch when user submits input
          />

          {/* MapView */}
          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE} // Use Google Maps
            region={mapRegion} // Center the map based on the mapRegion state
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {/* No markers here to focus on the search functionality */}
          </MapView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    zIndex: 1, // Ensure the search bar is above the map
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;
