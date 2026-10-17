import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
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
import { CommonActions, useNavigation } from "@react-navigation/native";
import { apiGet, apiDelete, clearSessionStorage } from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";
import { tw } from "../../utils/styling";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const Profile = () => {
  const [UserData, setUserData] = useState("");
  const navigation = useNavigation();
  const [status_success, setstatus_success] = useState("false");

  const getuserProfile = async () => {
    setUserData("");
    setstatus_success(false);
    try {
      const response = await apiGet(base.getUserProfile);

      if (response.status == 200 && response.data.success) {
        setUserData(response.data.data);
        setstatus_success("true");
      } else {
        setstatus_success("error");
      }
    } catch (error) {
      console.log("Error in Profile Screen", error);
      setstatus_success("error");
    }
  };
  useEffect(() => {
    getuserProfile();
  }, []);

  const clearSessionAndGoToLogin = async () => {
    await clearSessionStorage();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => LogoutUser(),
          style: "destructive",
        },
      ]
    );
  };

  const LogoutUser = async () => {
    try {
      await apiGet(base.logout);
    } catch (error) {
      console.log("error Profile Screen (Logout)", error);
    } finally {
      await clearSessionAndGoToLogin();
    }
  };

      const confirmDeleteAccount = () => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => handleDeleteAccount(),
              style: 'destructive',
            },
          ],
          { cancelable: true }
        );
      };

      const handleDeleteAccount = async () => {
        try {
          const res = await apiDelete(base.deleteAccount);
          console.log(res.data)
          if (res.status == 200 || res.data?.success || res.data?.status == 200) {
            await clearSessionAndGoToLogin();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: res.data.message
            })
          }

        } catch (error) {
          console.error("🚀 ~ delete account ~ error", error.response?.data?.message || error.message)
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong'
          })
        }
      }
  return (
    <ScrollView contentContainerStyle={{flexGrow:1,  paddingBottom: 60 }} style={{ padding: "1%", backgroundColor: "#fff" }}>
      {status_success && UserData ? (
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <Text style={styles.HeaderTitleTxt}>Profile</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Image
                source={images.pen}
                style={{
                  position: "absolute",
                  right: 30,
                  height: 16,
                  width: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.LoginTxt1}>{UserData?.user_profile?.name || UserData?.name || ""}</Text>
          <Text style={styles.LoginTxt2}>{UserData?.email}</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("About")} style={[styles.fieldCont, { marginTop: "10%" }]}>
            <Image
              source={images.info}
              style={[styles.allIcon, { position: "absolute", left: 20 }]}
            />
            <Text style={styles.fieldTxt}>About</Text>
            <Image
              source={images.arrowRight}
              style={[styles.allIcon, { position: "absolute", right: 20 }]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fieldCont}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Image
              source={images.padlock}
              style={[styles.allIcon, { position: "absolute", left: 20 }]}
            />
            <Text style={styles.fieldTxt}>Change Password</Text>
            <Image
              source={images.arrowRight}
              style={[styles.allIcon, { position: "absolute", right: 20 }]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fieldCont, { marginBottom: 20 }]}
            onPress={() => handleLogout()}
          >
            <Image
              source={images.logout3}
              style={[styles.allIcon, { position: "absolute", left: 20 ,tintColor:'red'}]}
            />
            <Text style={[styles.fieldTxt, { color: "red" }]}>Log Out</Text>
            <Image
              source={images.arrowRight}
              style={[styles.allIcon, { position: "absolute", right: 20 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={confirmDeleteAccount}
          style={[tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[90%] rounded-full p-3`,{alignSelf:'center'}]}
        >
          <View style={tw`flex-row items-center gap-3 `}>

          <Image source={images.delete} style={{height:20,width:20}} />

            <Text style={tw`text-[#EA2021]  text-lg `}>Delete Account</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>
        </SafeAreaView>
      ) : status_success === "error" ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ color: "#000", marginBottom: 16, textAlign: "center" }}>
            Unable to load profile. Please try again or log out.
          </Text>
          <TouchableOpacity onPress={getuserProfile} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#2F6836", fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: "red", fontWeight: "600" }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size={"large"} style={{ flex: 1 }} />
      )}

    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  LoginTxt1: {
    color: "#000",
    fontSize: width / 18,
    marginHorizontal: "6%",
    fontWeight: "500",
    marginBottom: 5,
  },
  LoginTxt2: {
    color: "#000",
    fontSize: width / 25,
    marginHorizontal: "6%",
  },
  AccountContainer: {
    height: height / 2,
    width: width - 80,
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
    marginTop: "5%",
    height: height / 16,
    width: width / 1.1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#c9c9c9",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "15%",
  },
  fieldTxt: {
    color: "#000",
    fontSize: width / 24,
  },
  allIcon: {
    height: 20,
    width: 20,
    alignSelf: "center",
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

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: height / 20,
    marginTop: "4%",
    marginBottom: 20,
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 20,
    marginHorizontal: "6%",
    fontWeight: "600",

  },
});
