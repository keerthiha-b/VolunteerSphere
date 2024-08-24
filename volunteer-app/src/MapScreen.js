
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// Import API key securely from the environment variables
import { GOOGLE_MAPS_API_KEY } from '@env';

// Import images
const images = {
  Health: require('./images/Health.jpg'),
};

const MapScreen = () => {
  const [activities, setActivities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search bar state

  useEffect(() => {
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

        await fetchActivities();
      } catch (error) {
        console.error('Error fetching user location or activities:', error);
        Alert.alert('Error', 'Failed to fetch user location or activities.');
      }
    })();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('https://volunteersphere.onrender.com/api/map/activities');
      const data = await response.json();

      if (Array.isArray(data)) {
        // Geocode addresses to get latitude and longitude
        const geocodedActivities = await Promise.all(
          data.map(async (activity) => {
            if (activity.address) {
              const coordinates = await geocodeAddress(activity.address);
              return { ...activity, ...coordinates };
            }
            return activity;
          })
        );
        setActivities(geocodedActivities);
      } else {
        console.error('Data fetched is not an array:', data);
        Alert.alert('Error', 'Unexpected data format.');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to load volunteer opportunities.');
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error('Geocoding error:', data.status);
        return { latitude: null, longitude: null };
      }
    } catch (error) {
      console.error('Error in geocoding address:', error);
      return { latitude: null, longitude: null };
    }
  };

  // Function to handle searching for an address
  const handleSearch = async () => {
    if (searchQuery) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        searchQuery
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
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
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Failed to fetch the location.');
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
            placeholder="Search for opportunities or address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Distance Away</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Best Overall</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Favorites</Text>
            </TouchableOpacity>
          </View>

          {/* MapView */}
          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            region={mapRegion}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {/* Render Markers for each activity */}
            {activities.map((activity) => {
              if (activity.latitude != null && activity.longitude != null) {
                return (
                  <Marker
                    key={activity._id}
                    coordinate={{
                      latitude: activity.latitude,
                      longitude: activity.longitude,
                    }}
                    pinColor="#FA7F35" // Orange color for the marker
                    title={activity.name}
                  >
                    <Callout tooltip>
                      <View style={styles.calloutContainer}>
                        <View style={styles.callout}>
                          {/* Display the image based on the category */}
                          {images[activity.category] ? (
                            <Image
                              source={'./images/Health.jpg'}
                              style={styles.activityImage}
                            />
                          ) : (
                            <Image
                              source={require('./images/PlayerChar.png')} // Default image if not found
                              style={styles.activityImage}
                            />
                          )}
                          <Text style={styles.calloutTitle}>{activity.name || 'No Name'}</Text>
                          <Text>{activity.category || 'No Organization Name'}</Text>
                          <Text>{activity.duration || 'No Duration'}</Text>
                          <TouchableOpacity style={styles.signupButton} onPress={() => Alert.alert('Sign Up', `Sign up for ${activity.name}`)}>
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Callout>
                  </Marker>
                );
              } else {
                console.warn(`Invalid coordinates for activity ID: ${activity._id}`);
                return null;
              }
            })}
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
    zIndex: 1,
  },
  filterContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  filterButton: {
    backgroundColor: '#FA7F35', // Orange color for filter buttons
    padding: 10,
    borderRadius: 20,
  },
  filterButtonText: {
    color: 'white', // White text color for better contrast
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  callout: {
    width: 200,
    backgroundColor: 'white', // Ensure a solid white background
    borderRadius: 10,
    shadowColor: '#000', // Shadow color for the callout
    shadowOffset: { width: 0, height: 2 }, // Offset for shadow
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 3, // Blur radius for shadow
    elevation: 5, // Elevation for Android shadow
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#000', // Ensure text is visible by setting color explicitly
  },
  signupButton: {
    backgroundColor: '#FA7F35', // Orange color for the signup button
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  signupButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  activityImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 5, // Add border radius for rounded corners
    resizeMode: 'contain', 
  },
});

export default MapScreen;