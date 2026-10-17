import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ApiService from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  userLoginAuthentication,
  userRegisterAuthentication,
} from "../../ApiHandling/NewFormate/ApiFunction";

const { height, width } = Dimensions.get("window");

const Register = () => {
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

const handleLogin = async () => {
    if (!email || !Password || !name || !ConfirmPassword) {
      ToastAndroid.show("Please Fill All Field", ToastAndroid.SHORT);
      console.log("Please Fill All Field");
      return;
    }
    try {
      const userData = {
        email,
        name,
        password: Password,
        confirm_password: ConfirmPassword,
        mobile : "1234567890"
      };
      console.log("userData", userData);
      if (userData.password !== userData.confirm_password) {
        return ToastAndroid.show(
          "Password didn't match. Check Again!",
          ToastAndroid.SHORT
        );
      }

      const response = await userRegisterAuthentication(userData);
      console.log("🎁 Response ", response);
      if (response?.status == 201) {
        navigation.navigate("OTP", { key: email });
      }

    } catch (error) {
        console.log("Error come from login screen", error);
        }
      };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ height: height }}>
        <Image source={images.LogoSanitation} style={styles.Logo} />
        <Text style={styles.LoginTxt1}>Register</Text>
        <Text style={styles.LoginTxt2}>Register Your Account</Text>

        <View style={styles.AccountContainer}>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Name</Text>
            <TextInput
              style={styles.InputBox}
              placeholder="Name"
              placeholderTextColor={"#929292"}
              value={name}
              onChangeText={(value) => setname(value)}
            ></TextInput>
          </View>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Email</Text>
            <TextInput
              style={styles.InputBox}
              placeholder="Email"
              placeholderTextColor={"#929292"}
              value={email}
              onChangeText={(value) => setemail(value)}
            ></TextInput>
          </View>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Password</Text>
            <TextInput
              style={styles.InputBox}
              placeholder="Password"
              placeholderTextColor={"#929292"}
              value={Password}
              onChangeText={(value) => setPassword(value)}
            ></TextInput>
          </View>
          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}> Confirm Password</Text>
            <TextInput
              style={styles.InputBox}
              placeholder=" Confirm Password"
              placeholderTextColor={"#929292"}
              value={ConfirmPassword}
              onChangeText={(value) => setConfirmPassword(value)}
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
              onPress={() => handleLogin()}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.newAccount}>Already have a Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  newAccount: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
    marginTop: "5%",
  },
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
    width: width - 80,

    alignSelf: "center",

  },
  Logo: {
    height: 200,
    width: 200,
  },
  InputBox: {
    height: height / 18,

    borderRadius: 60,
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
  },
  fieldCont: {
    marginTop: "10%",
  },
  LoginBtn: {
    height: height / 18,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: ["rgba(8, 246, 36, 1)", "rgba(36, 51, 82, 1)"],
    marginTop: "20%",
  },
  LoginBtnTxt: { color: "#000" },

  linearGradient: {
    borderRadius: 30,
    marginTop: "10%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "600", color: "#fff" },

  ForgotTxt: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
    marginTop: "5%",
  },
});
