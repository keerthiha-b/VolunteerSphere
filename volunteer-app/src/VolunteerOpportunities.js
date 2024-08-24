import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native'; // Import Text from react-native
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// Import the API key from environment variables using @env
import { GOOGLE_MAPS_API_KEY } from '@env';

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
      const response = await fetch('https://volunteersphere.onrender.com/api/map/activities'); // Use your Render endpoint URL
      const data = await response.json();

      // Check if the response data is an array
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        console.error('Data fetched is not an array:', data);
        Alert.alert('Error', 'Unexpected data format.');
      }
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
                {/* Callout for Marker Details */}
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{activity.name || 'No Name'}</Text> {/* Ensure name is not undefined */}
                    <Text>{activity.category || 'No Category'}</Text>
                    <Text>{activity.duration || 'No Duration'}</Text>
                    <Text>{activity.address || 'No Address'}</Text>
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
