import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import images from "../../assets/images";
import { tw } from "../../utils/styling";
import { getAllTermsConditions } from "../../ApiHandling/NewFormate/ApiFunction";
import WebView from "react-native-webview";

const TAndC = () => {
  const navigation = useNavigation();

  const [termsAndConditionsData, settermsAndConditionsData] = useState("");
  const [statusCode, setstatusCode] = useState("false");
  const [htmlDataDescription, sethtmlDataDescription] = useState("");

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    settermsAndConditionsData("");
    setstatusCode(false);
    try {
      const response = await getAllTermsConditions();
      console.log(" ~ 🎈~ response", response);
      if (response.status == 200) {
        settermsAndConditionsData(response.data);
        setstatusCode(true);
        sethtmlDataDescription(response.data[0]?.description);

      }
    } catch (error) {
      ToastAndroid.show("Something wents wrong", ToastAndroid.SHORT);
      console.log("~ 🎈~ Error form TAndC Screen", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 `}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={tw`h-[7%]  flex-row  px-8 gap-4   mt-5 `}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2   h-8 w-8  items-center justify-center  my-auto bg-transparent border-[.5px] border-white  rounded-full  `}
        >
          <Image
            source={images.back}
            tintColor={"#000"}
            style={tw`w-5 h-5  `}
          />
        </TouchableOpacity>

        <Text style={tw`text-black my-auto text-xl font-medium  `}>
          Terms & Conditions
        </Text>
      </View>
      {statusCode ? (
        <ScrollView style={tw`flex-1 `}>
          <Text style={tw`text-neutral-800 text-base px-4 `}>
            {termsAndConditionsData[0]?.heading}
          </Text>

          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlDataDescription }}
            style={{ flex: 1  }}
          />
          <Text style={tw`text-neutral-800 text-base px-4 py-4`}>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </ScrollView>
      ) : (
        <ActivityIndicator size={"small"} style={{ flex: 1 }} />
      )}
    </SafeAreaView>
  );
};

export default TAndC;
