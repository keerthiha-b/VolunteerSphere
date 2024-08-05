import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const MapboxWebView = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Print out the current location
      console.log('Current location:', currentLocation);
      Alert.alert('Current location', `Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}`);
    })();
  }, []);

  if (!location) {
    return null; // Or a loading spinner
  }

  const htmlContent = `
    <html>
      <head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js'></script>
        <style>
          body, #map { margin: 0; padding: 0; height: 90%; width: 100%; }
          #searchBar {
            position: absolute;
            top: 10px;
            left: 50%;
            width: 300px;
            margin-left: -150px; /* Centers the search bar */
            z-index: 1;
          }
        </style>
      </head>
      <body>
        <div id='searchBar'>
            <input type="text" id="searchInput" placeholder="Search for places" />
            <button onclick="searchLocations()">Search</button>
        </div>
        <div id='map'></div>
        <script>
          mapboxgl.accessToken = 'pk.eyJ1IjoidmFpYnNzIiwiYSI6ImNsejZiZHJicDFmYzcyanEyMDRjbjNra3YifQ.M1EUlJH4NvEwGMHcGNf9gQ';
          var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [${location.coords.longitude}, ${location.coords.latitude}], // Center coordinates for current location
            zoom: 12 // Zoom level
          });

          // Add geolocate control to the map.
          var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {enableHighAccuracy: true},
            trackUserLocation: true,
            showUserHeading: true,
          });

          map.addControl(geolocate);

          map.on('load', function() {
            // Ensure the geolocate control is visible and tracking
            geolocate.trigger();
            console.log('Map loaded and geolocate control triggered');
          });

          geolocate.on('geolocate', function(e) {
            // Center the map on the user's location when geolocated
            map.flyTo({
              center: [e.coords.longitude, e.coords.latitude],
              essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
            console.log('Geolocate event: ', e);
          });

          geolocate.on('error', function(error) {
            console.error('Geolocate error: ', error);
          });

          function searchLocations() {
            var input = document.getElementById('searchInput').value;
            fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(input) + '.json?access_token=' + mapboxgl.accessToken)
              .then(response => response.json())
              .then(data => {
                if (data.features && data.features.length > 0) {
                  var firstResult = data.features[0];
                  map.flyTo({ center: firstResult.center, zoom: 12 });
                } else {
                  alert('No results found');
                }
              })
              .catch(error => console.error('Error searching locations:', error));
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.container}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      geolocationEnabled={true}
      onMessage={(event) => {
        alert('Message from WebView: ' + event.nativeEvent.data);
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        alert('WebView error: ' + nativeEvent);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default MapboxWebView;