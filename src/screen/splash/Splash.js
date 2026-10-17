import React, { useCallback } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import images from "../../assets/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearSessionStorage,
  isTokenExpired,
} from "../../ApiServices/ApiService";

const Splash = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const tokenExpires = await AsyncStorage.getItem("tokenExpires");

          if (token && !isTokenExpired(token, tokenExpires)) {
            navigation.replace("Tabs");
            return;
          }

          if (token) {
            await clearSessionStorage();
          }
          navigation.replace("Login");
        } catch (error) {
          navigation.replace("Login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Image
        source={images.SplashLogo}
        style={{
          alignSelf: "center",
          zIndex: 5,
          position: "absolute",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  linearGradient: {
    flex: 1,
  },
});

export default Splash;
