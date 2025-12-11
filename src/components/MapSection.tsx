import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { GEOCODE_API } from '@env'

type MapSectionProps = {
  onPickupSelected: (location: any) => void;
  onDropSelected: (location: any) => void;
};

const MapSection: React.FC<MapSectionProps> = ({
  onPickupSelected,
  onDropSelected,
}) => {

  const [tapCount, setTapCount] = useState(0);
  const [pickupMarker, setPickupMarker] = useState<any>(null);
  const [dropMarker, setDropMarker] = useState<any>(null);

  const getPlaceName = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEOCODE_API}`
    );
    const data = await response.json();
    return data.results[0]?.formatted_address
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const address = await getPlaceName(latitude, longitude);

    const locationData = {
      latitude,
      longitude,
      address,
    };

    if (tapCount === 0) {
      setPickupMarker(locationData);
      onPickupSelected(locationData);

      Toast.show({ type: "success", text1: "Pickup selected!", text2: `${locationData.address}` });

      setTapCount(1);
    } else {
      setDropMarker(locationData);
      onDropSelected(locationData);

      Toast.show({ type: "success", text1: "Drop selected!", text2: `${locationData.address}` });

      setTapCount(0);
    }
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
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {pickupMarker && (
          <Marker
            coordinate={{
              latitude: pickupMarker.latitude,
              longitude: pickupMarker.longitude,
            }}
            title="Pickup Location"
            pinColor="green"
          />
        )}

        {dropMarker && (
          <Marker
            coordinate={{
              latitude: dropMarker.latitude,
              longitude: dropMarker.longitude,
            }}
            title="Drop Location"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

export default MapSection;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
});
