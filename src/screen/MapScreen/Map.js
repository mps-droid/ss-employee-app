import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Platform, Dimensions, TouchableOpacity, Image } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import Geolocation from "@react-native-community/geolocation";
import { SafeAreaView } from "react-native";
import images from "../../assets/images";
import Config from "react-native-config";

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_DIRECTIONS_API_KEY;

const Map = () => {
  const route = useRoute();
  const navigation = useNavigation()
  const {height,width} = Dimensions.get('window')
  console.log("Full Route Object:", route);
  console.log("Extracted Params:", route?.params);

  const [currentLocation, setCurrentLocation] = useState(null);
  const serviceLocation = route?.params?.location ||  { latitude: 26.9124, longitude: 75.7873 };;

  console.log("Final Service Location Used:", serviceLocation);

  const requestLocationPermission = async () => {
    console.log("Requesting Location Permission...");
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        console.log("Permission Granted:", granted);
        if (
          granted["android.permission.ACCESS_FINE_LOCATION"] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("❌ Location permission denied");
          return false;
        }
      } catch (err) {
        console.warn("Permission request error:", err);
        return false;
      }
    }
    return true;
  };

  const fetchCurrentLocation = async () => {
    console.log("Fetching Current Location...");
    const permissionGranted = await requestLocationPermission();

    if (!permissionGranted) {
      console.log("❌ Cannot fetch location without permission");
      return;
    }

    console.log("⚡ Calling Geolocation API...");
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ User Current Location:", position.coords);
        setCurrentLocation(position.coords);
      },
      (error) => {
        console.log("❌ Error getting location:", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);
  const origin = { latitude: 26.9124, longitude: 75.7873 };
  const destination = { latitude: 28.7041, longitude: 77.1025 };
  return (
    <SafeAreaView style={styles.container}>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",

          zIndex:1000

        }}
      >
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} style={{height:20,width:20}} />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>Direction</Text>
      </View>
      <MapView
        provider={
          Platform.OS == 'android' ?
          PROVIDER_GOOGLE
          :
           PROVIDER_DEFAULT
        }

        mapType="standard"
        style={[styles.map,{}]}
        initialRegion={{
          latitude: serviceLocation.latitude,
          longitude: serviceLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={serviceLocation} title="Service Location" />

        {currentLocation && (
          <Marker coordinate={currentLocation} title="Your Location" pinColor="blue" />
        )}

        {currentLocation && (
          <MapViewDirections
            origin={origin}
            destination={destination}

            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="black"
            onStart={(params) =>
              console.log(`Routing started from ${params.origin} to ${params.destination}`)
            }
            onError={(errorMessage) => {
              console.log("Directions API Error:", errorMessage);
              if (errorMessage.includes("ZERO_RESULTS")) {
                alert("No available route between your location and the destination.");
              }
            }}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBackBtn: {

    position: "absolute",
    left: "3%",
  },
  titleTxt: {
    fontSize: 20,
    color: "#432C1F",
    fontWeight: "700",

  },
});
