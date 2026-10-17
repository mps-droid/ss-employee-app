import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { tw } from "../../utils/styling";
import images from "../../assets/images";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { userAccountVerification } from "../../ApiHandling/NewFormate/ApiFunction";

const OTP = ({ route }) => {

  console.log("route ", route);
  const role_id = 7;
  const type = "email_varification";

  const CELL_COUNT = 4;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const navigation = useNavigation();

  const VerifyAccount = async () => {
    console.log("route.params.key", route?.params?.key);
    try {
      if (!value) {
        return ToastAndroid.show("Please Enter valid Otp!", ToastAndroid.SHORT);
      }
      const data = { email: route?.params?.key, otp: value, type };
      console.log("🧧data", data);
      const response = await userAccountVerification(data);
      console.log("~ 🎁 ~ response", response);

      if (response.status == 200) {
        ToastAndroid.show("Account Verified", ToastAndroid.SHORT);
        navigation.navigate("Tabs");
      } else {
        ToastAndroid.show("Something is Wrong", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("🎈 Error comes from otp screen", error);
    }

  };

  return (
    <View style={tw`flex-1 bg-[#FFFFFF] `}>
      <View
        style={tw`px-8  ${Platform.OS == "android" && "pt-4"} items-start  `}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw` items-center py-2 mt-2 rounded-lg `}

        >
          <Image
            source={images.back}
            tintColor={"#000"}
            style={tw` h-5 w-10`}
          />
        </TouchableOpacity>
      </View>
      <View style={tw`items-center my-8 `}>
        <Text style={tw`text-2xl font-medium text-neutral-700 text-center  `}>
          OTP Verification
        </Text>
        <Text style={tw` text-neutral-600 text-center mt-2 `}>
          Please enter OTP sent to your given email ID {route?.params?.key}
        </Text>
        {console.log(value)}
      </View>
      <View style={tw`w-[80%] self-center `}>
        <CodeField
          ref={ref}
          {...props}

          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        <LinearGradient
          colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => VerifyAccount()}
          >
            <Text style={styles.buttonText}>Verify </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};
export default OTP;

const styles = StyleSheet.create({
  buttonText: { fontWeight: "600", color: "#fff" },
  linearGradient: {
    borderRadius: 30,
    marginTop: "20%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 10 },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#00000030",
    textAlign: "center",
    color: "#000000",
  },
  focusCell: {
    borderColor: "rgb(23, 152, 38)",
  },
});
