import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import images from "../../assets/images";
  import LinearGradient from "react-native-linear-gradient";
  import { useNavigation } from "@react-navigation/native";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import {
    UserForgotPassword,
    userAccountVerification,
  } from "../../ApiHandling/NewFormate/ApiFunction";
import { apiPost } from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";

  const { height, width } = Dimensions.get("window");

  const ForgotPassword = ({ route }) => {
    const navigation = useNavigation();
    const email = route?.params?.key || "";

    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleSendOtp = async () => {

      if (!email) {
        ToastAndroid.show("Invalid email!", ToastAndroid.SHORT);
        return;
      }

      try {
        const response = await apiPost(
          base.sendOTP,
          { email, type: "forgot_password" },
          { auth: false }
        );
        console.log(response,"send");
        if (response?.status === 200) {
          ToastAndroid.show("OTP sent to your email!", ToastAndroid.SHORT);
          setIsOtpSent(true);
        } else {
          ToastAndroid.show("Failed to send OTP!", ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log("Error sending OTP:", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
      }
    };

    const handleVerifyOtp = async () => {

      if (!otp) {
        ToastAndroid.show("Please enter OTP!", ToastAndroid.SHORT);
        return;
      }

      try {
        const userData = { email: route?.params?.key, otp, type: "forgot_password" };
        const response = await userAccountVerification(userData);

        if (response?.status === 200) {
          ToastAndroid.show("Account Verified!", ToastAndroid.SHORT);
          navigation.navigate("ResetPassword", { email });
        } else {
          ToastAndroid.show("Invalid OTP!", ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log("Error verifying OTP:", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
      }
    };

    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={{ height: height }}>
          <Image source={images.LogoSanitation} style={styles.Logo} />
          <Text style={styles.LoginTxt1}>Forgot Password?</Text>
          <Text style={styles.LoginTxt2}>Reset Your Account</Text>

          <View style={styles.AccountContainer}>

            <View style={styles.fieldCont}>
              <Text style={styles.titleTxt}>Email</Text>
              <TextInput
                style={[styles.InputBox, { backgroundColor: "#e0e0e0" }]}
                placeholder="Email"
                placeholderTextColor={"#929292"}
                value={email}
                editable={false}
              />
            </View>

            {isOtpSent && (
              <View style={styles.fieldCont}>
                <Text style={styles.titleTxt}>Enter OTP</Text>
                <TextInput
                  style={styles.InputBox}
                  placeholder="Enter OTP"
                  placeholderTextColor={"#929292"}
                  value={otp}
                  onChangeText={(value) => setOtp(value)}
                  keyboardType="numeric"
                />
              </View>
            )}

            {!isOtpSent && (
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOtp}
                >
                  <Text style={styles.buttonText}>SEND OTP</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

            {isOtpSent && (
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleVerifyOtp}
                >
                  <Text style={styles.buttonText}>VERIFY OTP</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  };

  export default ForgotPassword;

  const styles = StyleSheet.create({
    LoginTxt1: {
      color: "#000",
      fontSize: width / 15,
      marginHorizontal: "6%",
      fontWeight:'600'
    },
    LoginTxt2: {
      color: "#000",
      fontSize: width / 25,
      marginHorizontal: "6%",
      marginTop:8
    },
    AccountContainer: {
      height: height / 2,
      width: '90%',
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
    titleTxt: {
      color: "#000",
    },
    fieldCont: {
      marginTop: "10%",
    },
    linearGradient: {
      borderRadius: 30,
      marginTop: "10%",
      padding: 15,
      justifyContent: "center",
      alignItems: "center",

    },
    buttonText: {
      fontWeight: "600",
      color: "#fff",
    },
  });
