import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { base } from "../../Api/Constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { persistSession, toRoleId, apiPost } from "../../ApiServices/ApiService";

const { height, width } = Dimensions.get("window");
const roles = [
  { id: 7, name: "Supervisor" },
  { id: 8, name: "Quality Inspector" },
  { id: 9, name: "Cleaner" },
];

const Login = () => {
  const navigation = useNavigation();

  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !Password) {
      Toast.show({ type: "error", text1: "Please enter email and password!" });
      return;
    }
    if (!selectedRole?.id) {
      Toast.show({ type: "error", text1: "Please select a role" });
      return;
    }
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const roleId = toRoleId(selectedRole.id);
      const response = await apiPost(
        base.login,
        {
          email: trimmedEmail,
          password: Password,
        },
        {
          auth: false,
          headers: {
            role_id: String(roleId),
          },
        }
      );

      const json = response?.data || {};
      const user = json?.data && typeof json.data === "object" ? json.data : {};
      const token = user?.tokens?.access?.token;
      const expires = user?.tokens?.access?.expires;
      const sessionRoleId = toRoleId(user?.role_id ?? roleId);

      if (response.status === 200 && json?.success !== false && token) {
        await persistSession({
          token,
          expires,
          roleId: sessionRoleId,
          userId: user?.id,
          userName:
            user?.name ||
            user?.user_profile?.name ||
            user?.user_name ||
            trimmedEmail,
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Tabs" }],
          })
        );
        return;
      }

      Toast.show({
        type: "error",
        text1: json?.message || `Login failed (${response.status})`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          error?.message ||
          "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Roles on Load:", roles);
  }, [roles]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center" }}

      >
        <Image source={images.LogoSanitation} style={styles.Logo} />
        <Text style={styles.LoginTxt1}>Login</Text>
        <Text style={styles.LoginTxt2}>Log in to Your Account</Text>

        <View style={styles.AccountContainer}>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Select Role</Text>
            <TouchableOpacity
            style={[styles.InputBox, styles.dropdownContainer]}
            onPress={() => {
              console.log("Dropdown Pressed");
              setModalVisible(true);
            }}
            activeOpacity={0.8}
  pointerEvents="auto"
            >
              <Text style={styles.InputBoxTxt}>{selectedRole ? selectedRole.name : "Select Role"}</Text>
              <Image source={images.dropdown} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>

           <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >

              <View style={styles.modalContainer}>

                <FlatList
                  data={roles}
                  keyExtractor={(item) => String(item?.id ?? item?.name)}
                  renderItem={({ item }) => {
                    console.log("Rendering Role:", item)
                    return(
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        console.log("Role Selected:", item);
                        setSelectedRole(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalText}>{item.name}</Text>
                    </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Email</Text>
            <TextInput
              style={styles.InputBox}
              placeholder="Email"
              placeholderTextColor={"#929292"}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => setemail(value)}
            >

            </TextInput>
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
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            disabled={loading}
            onPress={() => handleLogin()}
          >
            <LinearGradient
              colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradient}
            >
              <Text style={styles.buttonText}>{loading ? "LOGGING IN..." : "LOGIN"}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.ForgotTxt}>Forgot Password?</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  newAccount: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
  },
  LoginTxt1: {
    color: "#000",
    fontSize: 24,
    marginHorizontal: "6%",
    fontWeight:'600'
  },
  LoginTxt2: {
    color: "#000",
    fontSize: 14,
    marginHorizontal: "6%",
    fontWeight:'300',
    marginTop:8
  },
  AccountContainer: {

    flex: 1,
    width: width - 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  Logo: {
    height: 200,
    width: 200,
  },
  InputBox: {
    height: height / 16,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ECECEC",
    paddingLeft: 20,
    marginTop: "2%",
    color: "#000",
    paddingVertical:5
  },
  InputBoxTxt: { color: "#929292" },
  titleTxt: {
    color: "#000",
  },
  fieldCont: {
    marginTop: "5%",
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

    marginTop: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "600", color: "#fff" },

  ForgotTxt: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",

    marginTop: 20,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
    marginRight:10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: 250,
    borderRadius: 10,
    paddingVertical: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
});
