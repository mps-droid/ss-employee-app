import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { base } from "../../Api/Constants";
import { postFormData } from "../../ApiServices/ApiService";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const ChangePassword = () => {
  const navigation = useNavigation();
  const [currentPasswordVisible, setcurrentPasswordVisible] = useState(true);
  const [newPasswordVisible, setnewPasswordVisible] = useState(true);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Toast.show({ type: "error", text1: "Please fill all fields" });
        return;
      }

      if (newPassword !== confirmPassword) {
        Toast.show({ type: "error", text1: "Passwords do not match" });
        return;
      }

      const response = await postFormData(base.changePassword, {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.status === 200 || response.data?.success) {
        Toast.show({ type: "success", text1: "Password changed successfully" });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: response.data?.message || "Unable to change password",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Error changing password",
      });
    }
  };

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
        <Text style={styles.HeaderTitleTxt}>Change Password</Text>
      </View>

      <View style={styles.AccountContainer}>
        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>Current Password</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.InputBox}
              placeholder="Current Pasword"
              placeholderTextColor={"#929292"}
              secureTextEntry={currentPasswordVisible}
              value={currentPassword}
              onChangeText={(data) => setcurrentPassword(data)}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setcurrentPasswordVisible(!currentPasswordVisible)}
              style={{ position: "absolute", right: 20, top: 25 }}
            >
              <Image
                source={
                  currentPasswordVisible == true ? images.eyeSlash : images.eye
                }
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>New Password</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.InputBox}
              placeholder="New Pasword"
              placeholderTextColor={"#929292"}
              secureTextEntry={newPasswordVisible}
              value={newPassword}
              onChangeText={(data) => setnewPassword(data)}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setnewPasswordVisible(!newPasswordVisible)}
              style={{ position: "absolute", right: 20, top: 25 }}
            >
              <Image
                source={
                  newPasswordVisible == true ? images.eyeSlash : images.eye
                }
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.fieldCont}>
          <Text style={styles.titleTxt}>Confirm New Password</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.InputBox}
              placeholder="Confirm New Pasword"
              placeholderTextColor={"#929292"}
              secureTextEntry={ConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={(data) => setconfirmPassword(data)}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!ConfirmPasswordVisible)}
              style={{ position: "absolute", right: 20, top: 25 }}
            >
              <Image
                source={
                  ConfirmPasswordVisible == true ? images.eyeSlash : images.eye
                }
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangePassword()}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

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
    height: height / 18,
    width: width - 40,
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
    marginTop: "10%",
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
  buttonText: { fontWeight: "600", color: "#fff" },

  ForgotTxt: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
    marginTop: "5%",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: height / 20,
    marginVertical: "4%",
    justifyContent: "center",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 22,
    marginHorizontal: "6%",
    fontWeight: "600",
  },
});
