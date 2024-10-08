import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Import images for each category
const images = {
  health: require('./images/Health.jpg'),
  environment: require('./images/cleaning.jpg'),
  education: require('./images/education.jpg'),
  'community service': require('./images/community.jpg'),
  'animal welfare': require('./images/animalwelfare.png'),
};

const MapScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
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
    })();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('https://volunteersphere.onrender.com/api/map/activities');
      const data = await response.json();

      if (Array.isArray(data)) {
        const geocodedActivities = await Promise.all(
          data.map(async (activity) => {
            if (activity.address) {
              const coordinates = await geocodeAddress(activity.address);
              return { ...activity, ...coordinates };
            }
            return activity;
          })
        );

        // Get current date
        const currentDate = new Date();

        // Filter activities by date to exclude past activities
        const filteredActivities = geocodedActivities.filter(activity => {
          const activityDate = new Date(activity.date); // Convert activity date from string to Date object
          return activityDate >= currentDate;  // Only include activities with date >= current date
        });

        setActivities(adjustCoordinates(filteredActivities));
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
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.error('Geocoding error:', data.status);
      return { latitude: null, longitude: null };
    }
  };

  const adjustCoordinates = (activities) => {
    const adjustmentFactor = 0.0010; // Distance factor to spread markers
    const clusters = {};

    activities.forEach(activity => {
      const key = `${activity.latitude.toFixed(4)}-${activity.longitude.toFixed(4)}`;
      if (!clusters[key]) {
        clusters[key] = {
          latitude: activity.latitude,
          longitude: activity.longitude,
          items: [activity]
        };
      } else {
        clusters[key].items.push(activity);
      }
    });

    const adjustedActivities = [];

    Object.keys(clusters).forEach(key => {
      const cluster = clusters[key];
      if (cluster.items.length === 1) {
        adjustedActivities.push(cluster.items[0]);
      } else {
        // Spread items around the central point
        const total = cluster.items.length;
        const angleStep = (2 * Math.PI) / total;
        cluster.items.forEach((item, index) => {
          const angle = angleStep * index;
          const adjustedLatitude = cluster.latitude + adjustmentFactor * Math.cos(angle);
          const adjustedLongitude = cluster.longitude + adjustmentFactor * Math.sin(angle);
          adjustedActivities.push({
            ...item,
            latitude: adjustedLatitude,
            longitude: adjustedLongitude
          });
        });
      }
    });

    return adjustedActivities;
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_MAPS_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          const newRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setMapRegion(newRegion);
          
          // Animate to the new region
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000); // The second parameter is the duration of the animation in ms
          }
        } else {
          Alert.alert('Location not found', 'Please try a different address.');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Failed to fetch the location.');
      }
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('https://volunteersphere.onrender.com/api/categories');
      const categories = await response.json();
      setCategories(categories);
    }
  
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      {mapRegion && (
        <>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for opportunities or address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.map(category => (
              <TouchableOpacity key={category._id} style={styles.filterButton} onPress={() => setFilter(category.name.toLowerCase())}>
                <Text style={styles.filterButtonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <MapView
            ref={mapRef} // Add the ref here
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            region={mapRegion}
            showsUserLocation={true}
            followsUserLocation={false}
          >
            {activities.filter(activity => filter === 'all' || activity.category.toLowerCase() === filter).map(activity => (
              <Marker
                key={activity._id}
                coordinate={{
                  latitude: activity.latitude,
                  longitude: activity.longitude,
                }}
                pinColor="#FA7F35"
                title={activity.name}
              >
                <Callout tooltip onPress={() => navigation.navigate('ActivityDetail', { activity: activity })}>
                  <View style={styles.calloutContainer}>
                    <Image source={images[activity.category.toLowerCase()] || images.health} style={styles.activityImage} />
                    <Text style={styles.calloutTitle}>{activity.name}</Text>
                    <Text>{activity.category || 'No Category'}</Text>
                    <Text>{activity.duration || 'No Duration'}</Text>
                    <TouchableOpacity style={styles.signupButton}>
                      <Text style={styles.signupButtonText}>Learn More</Text>
                    </TouchableOpacity>
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
    zIndex: 1,
  },
  filterButton: {
    backgroundColor: '#FA7F35',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: 'white',
  },
  map: {
    width: '100%',
    height: '100%',
    marginTop: 110, 
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  signupButton: {
    backgroundColor: '#FA7F35',
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
    borderRadius: 5,
    resizeMode: 'contain',
  },
});

export default MapScreen;