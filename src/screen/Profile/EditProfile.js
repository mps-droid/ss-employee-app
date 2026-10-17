import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getUserProfile,
  updateUserProfile,
} from "../../ApiHandling/NewFormate/ApiFunction";
import { apiGet, apiPut } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { base } from "../../Api/Constants";

const { height, width } = Dimensions.get("window");

const EditProfile = () => {
  const [userData, setuserData] = useState("");
  const navigation = useNavigation();

  const [userName, setuserName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userPhoneNo, setuserPhoneNo] = useState("");

  const getuserProfile = async () => {
    setuserData("");
    try {
      const response = await apiGet(base.getUserProfile);
      console.log("~🎈~ response from profile screen ", response);

      if (response.status == 200  && response.data.success) {
        const profileData = response.data.data || {};

        setuserData(profileData);
        setuserName(profileData?.user_profile?.name || profileData?.name || "");
        setuserEmail(profileData?.email || "");
        setuserPhoneNo(profileData?.user_profile?.mobile || profileData?.mobile || "");
      }

    } catch (error) {
      console.log("Error in Profile Screen", error);
      console.log("🚨 Error Response:", error.response?.data || error.message);
    }
  };

  const updateProfile = async () => {
    if (!userName || !userEmail || !userPhoneNo) {
      return ToastAndroid.show("Please Fill All the field", ToastAndroid.SHORT);
    }

    try {
      const response = await apiPut(base.updateProfile, {
        name: userName,
        mobile: userPhoneNo,
      });
      console.log(response.status);
      if (response.status == 200) {
        console.log("✅ Profile Updated Successfully:", response.data);

        await AsyncStorage.setItem("userProfile", JSON.stringify(response.data.data));

        ToastAndroid.show("Profile Update Successfully.", ToastAndroid.SHORT);
        navigation.navigate("Tabs");
      }
    if(response.data)
    console.log("~ 🎈~ Response After update user profile", response);
    } catch (error) {
      console.log("error Update Profile Screen", error);
      ToastAndroid.show(
        "Error while getting update user profile",
        ToastAndroid.SHORT
      );
    }
  };
 useEffect(() => {
    getuserProfile();
  }, []);

  useEffect(() => {
    updateProfile();
  }, []);

  return (
    <SafeAreaView style={{ padding: "1%", backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: "absolute", left: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={images.back}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.HeaderTitleTxt}>Edit Profile</Text>

      </View>

      <View style={styles.AccountContainer}>

        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>Name</Text>
          <TextInput
            style={styles.InputBox}
            placeholder="Enter Your Name"
            placeholderTextColor={"#929292"}
            value={userName}
            onChangeText={(data) => setuserName(data)}
          >

          </TextInput>
        </View>

        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>Email</Text>
          <TextInput
            style={styles.InputBox}
            placeholder="Enter Email id"
            placeholderTextColor={"#929292"}
            value={userEmail}
            onChangeText={(data) => setuserEmail(data)}
            editable={false}
          >

          </TextInput>
        </View>

        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>Phone Number</Text>
          <TextInput
            style={styles.InputBox}
            placeholder="Enter Phone number"
            placeholderTextColor={"#929292"}
            value={userPhoneNo}
            onChangeText={(data) => setuserPhoneNo(data)}
          ></TextInput>
        </View>

        <LinearGradient
          colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateProfile()}
          >
            <Text style={styles.buttonText}>Save Details</Text>
          </TouchableOpacity>
        </LinearGradient>

      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  LoginTxt1: {
    color: "#000",
    fontSize: width / 15,
    marginHorizontal: "6%",
  },
  LoginTxt2: {
    color: "#000",
    fontSize: width / 25,
    marginHorizontal: "6%",
  },
  AccountContainer: {
    height: height / 2,
    width: width - 40,

    alignSelf: "center",

  },
  Logo: {
    height: 200,
    width: 200,
  },
  InputBox: {
    height: height / 16,
    fontSize: height / 55,

    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ECECEC",

    paddingLeft: 20,
    marginTop: "2%",
    color: "#000",
  },
  InputBoxTxt: { color: "#929292" },
  titleTxt: {
    color: "#000",
    fontWeight: "700",
  },
  fieldCont: {
    marginTop: "7%",
  },
  LoginBtn: {
    height: height / 18,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: ["rgba(8, 246, 36, 1)", "rgba(36, 51, 82, 1)"],
    marginTop: "10%",
  },
  LoginBtnTxt: { color: "#000" },

  linearGradient: {
    borderRadius: 30,
    marginTop: "10%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "600", color: "#fff", fontSize: width / 22 },

  ForgotTxt: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
    marginTop: "5%",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    height: height / 15,

    alignItems: "center",
    justifyContent: "center",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 22,
    marginHorizontal: "6%",
    fontWeight: "600",
  },
});
