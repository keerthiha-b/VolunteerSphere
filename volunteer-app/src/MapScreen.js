import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_API_KEY = 'Put the tokens'; // Replace with your actual API key

const MapScreen = () => {
  const [activities, setActivities] = useState([]); // State to store fetched activities
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null); // State to store the map region

  useEffect(() => {
    // Request user location and fetch activities
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

        // Fetch and process activities
        await fetchActivities();
      } catch (error) {
        console.error('Error fetching user location or activities:', error);
        Alert.alert('Error', 'Failed to fetch user location or activities.');
      }
    })();
  }, []);

  // Function to fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/map/activities'); // Use the new map-related endpoint
      const data = await response.json();

      // Assuming your backend provides coordinates directly; otherwise, use geocoding to convert addresses to lat/lng.
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to load volunteer opportunities.');
    }
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <>
          {/* MapView */}
          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE} // Use Google Maps
            region={mapRegion} // Center the map based on the mapRegion state
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {/* Render Markers for each activity */}
            {activities.map((activity) => (
              <Marker
                key={activity._id}
                coordinate={{
                  latitude: activity.latitude, // Ensure your data includes latitude and longitude
                  longitude: activity.longitude,
                }}
                title={activity.name}
              >
                {/* Default Marker Icon (provided by MapView) */}
                
                {/* Callout for Marker Details */}
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{activity.name}</Text>
                    <Text>{activity.category}</Text>
                    <Text>{activity.duration}</Text>
                    <Text>{activity.address}</Text>
                    {/* Add more details as needed */}
                  </View>
                </Callout>
              </Marker>
            ))}
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
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MapScreen;
