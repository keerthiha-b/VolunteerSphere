import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;  // Make sure your environment setup is correct to fetch this value.

const MapboxWebView = () => {
  const htmlContent = `
    <html>
      <head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js'></script>
        <style>
          body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id='map'></div>
        <script>
          mapboxgl.accessToken = '${mapboxAccessToken}';  // Embed token directly into the script.
          var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.0066, 40.7135],
            zoom: 9
          });
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
