import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';
import Toast from 'react-native-toast-message';

const MapSection: React.FC = () => {

  const getPlaceName = async (lat: Number, lng: Number) => {

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAGy5ed5rJQJpERHUCiVaQnjoB5Nv0vPoM`
    );

    const data = await response.json();
    // Alert.alert(data.results[0]?.formatted_address, "Unknown place");
    Toast.show({
      type: "success",
      text1: "Hello!",
      text2: `${data.results[0]?.formatted_address}`,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.7041,
          longitude: 77.1025,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={async (e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;

          await getPlaceName(latitude, longitude);
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="My Location"
          description="This is where I am!"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapSection;
