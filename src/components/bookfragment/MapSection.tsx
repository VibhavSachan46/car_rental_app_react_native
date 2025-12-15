import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,

} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import NearbyList from "./NearbyList";
import { GOOGLE_API } from "@env";


type MapSectionProps = {
  onPickupSelected: (location: any) => void;
  onDropSelected: (location: any) => void;
  filterType?: string;
  setSelectedFilter: any;
  value: number
};

const MapSection: React.FC<MapSectionProps> = ({
  onPickupSelected,
  onDropSelected,
  filterType,
  setSelectedFilter,
  value
}) => {
  const [pickupMarker, setPickupMarker] = useState<any>(null);
  const [dropMarker, setDropMarker] = useState<any>(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<any[]>([]);


  const [showList, setShowList] = useState(false);

  const [region, setRegion] = useState({
    latitude: 28.7041,
    longitude: 77.1025,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const getPlaceName = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API}`
    );
    const data = await res.json();
    return data.results?.[0]?.formatted_address || "Unknown location";
  };

  useEffect(() => {
    const askPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      Geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          const address = await getPlaceName(latitude, longitude);

          const pickup = { latitude, longitude, address };
          setPickupMarker(pickup);
          onPickupSelected(pickup);

          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    };
    askPermission();
  }, []);

  const fetchNearby = async (type: string) => {
    if (!pickupMarker) return;

    const { latitude, longitude } = pickupMarker;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${value * 1000}&type=${type}&key=${GOOGLE_API}`;


    setNearbyMarkers([]);

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return;

    const markers = data.results.map((item: any) => ({
      id: item.place_id,
      name: item.name,
      vicinity: item.vicinity,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    }));

    setNearbyMarkers(markers);
    setShowList(true);
  };

  useEffect(() => {
    if (filterType) {
      fetchNearby(filterType);
    } else {
      setNearbyMarkers([]);
      setShowList(false);
    }
  }, [filterType, pickupMarker, value]);

  const handleSelectPlace = (place: any) => {
    const drop = {
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.name,
    };

    setDropMarker(drop);
    onDropSelected(drop);

    setRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setShowList(false);
    setSelectedFilter("");
  };

  const handleMapTap = () => {
    setShowList(false);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          minimumTrackTintColor="#0A8F8F"
          thumbTintColor="#0A8F8F"
          onValueChange={(val) => setValue(val)}
        />
        <Text style={styles.sliderValue}>{value} km</Text>
      </View> */}

      {showList && nearbyMarkers.length > 0 && (
        <NearbyList places={nearbyMarkers} onSelect={handleSelectPlace} />
      )}

      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapTap}
      >
        {pickupMarker && (
          <Marker coordinate={pickupMarker} pinColor="green" title="Pickup" />
        )}

        {dropMarker && (
          <Marker coordinate={dropMarker} pinColor="red" title="Drop" />
        )}

        {nearbyMarkers.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            pinColor="orange"
            onPress={() => handleSelectPlace(p)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapSection;

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },


});
