import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

const MapboxWebView = () => {
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
          mapboxgl.accessToken = 'ADD THE TOKEN HERE';
          var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-98.585522, 56.130366], // Center coordinates for Canada
            zoom: 3 // Zoom level adjusted to show a broad area
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
