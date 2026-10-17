import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { base } from "../../Api/Constants";
import { ActivityIndicator } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";

import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { apiPost } from "../../ApiServices/ApiService";

const { height, width } = Dimensions.get("window");

const AddImages = () => {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();

  const jobId = route.params?.jobId;

  useEffect(() => {
    console.log("Job Details in Add Images:", jobId);
  }, [jobId]);

  const uploadImages = async (id) => {
    console.log(id,"-=-=upload id");

    if (selectedImages.length === 0) {
      Alert.alert(
        "Error",
        "Please select at least one image before uploading."
      );
      return;
    }
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("booking_id", String(id));

      selectedImages.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: image.fileName || `image_${index}.jpg`,
          type: image.type || "image/jpeg",
        });
      });

      const response = await apiPost(base.uploadImages, formData);

      console.log("Upload response:", response);
      if (response.status === 201 || response.status === 200) {
        console.log("Images uploaded successfully:", response.data);
        Alert.alert("Success", "Images uploaded successfully!");
        navigation.navigate("JobDone", { jobId:jobId });

      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Response Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Possible network issue.");
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const openImagePicker = () => {
    Alert.alert(
      "Choose an option",
      "Select an image from the gallery or capture a new one.",
      [
        {
          text: "Gallery",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "Camera",
          onPress: () => captureImageWithCamera(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const pickImageFromGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1, selectionLimit: 0 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setSelectedImages((prevImages) => [
            ...prevImages,
            ...response.assets.map((image) => image),
          ]);
        }
        console.log("gallery====", response);
      }
    );
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs permission to access your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
  };

  const captureImageWithCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera access is required to take pictures.");
      return;
    }

    launchCamera({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera.");
        return;
      }
      if (response.errorCode) {
        console.error("Camera Error:", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setSelectedImages((prevImages) => [...prevImages, response.assets[0]]);
      }
      console.log("Camera Picture:", response);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={{ padding: "1%", backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: "absolute", left: 20, alignSelf: "center" }}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
        <Text style={[styles.HeaderTitleTxt, { alignSelf: "center" }]}>
          Add Images
        </Text>
      </View>

      <View style={{ marginHorizontal: "5%", marginTop: "5%" }}>
        <Text style={styles.uploadTxt}>Upload Images</Text>
        <Text style={{ color: "#000", marginTop: "5%", fontSize: width / 25 }}>
          Upload images after the job to ensure transparency and quality.
        </Text>
      </View>

      <View style={styles.AccountContainer}>
        <View style={styles.fieldCont}>
          <TouchableOpacity
            style={styles.addImagecontainer}
            onPress={openImagePicker}
          >
            <Image source={images.camera} />
            <Text style={styles.addImagecontainerTxt}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageGrid}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.BoxImages}>
              {console.log("URI", uri)}
              <TouchableOpacity
                style={{ position: "absolute", right: -5, top: -10, zIndex: 5 }}
                onPress={() => removeImage(index)}
              >
                <Image
                  source={images.close}
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: uri.uri }}
                style={{ height: "100%", width: "100%", borderRadius: 20 }}
              />
            </View>
          ))}
        </View>
      </View>

      <LinearGradient
        colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      >
        <TouchableOpacity
          style={[styles.Applybutton, loading && { opacity: 0.6 }]}
          onPress={() => uploadImages(jobId)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Images</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddImages;

const styles = StyleSheet.create({
  AccountContainer: {
    width: width - 40,
    alignSelf: "center",
  },
  fieldCont: {
    marginTop: "5%",
  },
  linearGradient: {
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: width - 30,
  },
  buttonText: { fontWeight: "600", color: "#fff" },
  headerContainer: {
    flexDirection: "row",
    height: height / 20,
    marginTop: "4%",
    justifyContent: "center",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 22,
    fontWeight: "600",
  },
  Applybutton: {
    width: "100%",
    alignItems: "center",
  },
  uploadTxt: {
    fontSize: width / 25,
    fontWeight: "700",
    color: "#000",
  },
  addImagecontainer: {
    height: height / 7,
    width: width - 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F6836",
    alignItems: "center",
    justifyContent: "center",
  },
  addImagecontainerTxt: {
    color: "#2F6836",
    fontSize: width / 25,
    marginTop: "1%",
    fontWeight: "700",
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: "3%",
  },
  BoxImages: {
    height: height / 9,
    width: width / 4,
    borderRadius: 20,
    backgroundColor: "#c9c9c9",
    margin: "1%",
    marginHorizontal: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
});
