import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import images from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { apiPost } from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";

const { height, width } = Dimensions.get("window");

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const navigation = useNavigation();
  const fetchChooseLanguage = async(language) => {
    try {
        const response = await apiPost(base.changeLanguage, {
          language: language === "English" ? "EN" : "SP",
        });
        console.log("response of data on language screen", response);
        if (response.status == 200) {
          console.log("🟢 language choose successfully:", response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(
          "❌ Error choosing language:",
          error.response?.data || error.message
        );
      }
  };

  return (
    <SafeAreaView style={{ padding: "1%", backgroundColor: "#fff", height: height }}>

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: "absolute", left: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
        <Text style={styles.HeaderTitleTxt}>Language</Text>
      </View>

      <TouchableOpacity
        style={[styles.fieldCont]}
        onPress={() => {
          setSelectedLanguage("English");
          fetchChooseLanguage("English");
        }}
      >
        <Text style={styles.fieldTxt}>English</Text>
        <Image
          source={
            selectedLanguage === "English"
              ? images.selectRadioBtn
              : images.subtract
          }
          style={styles.allIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fieldCont]}
        onPress={() =>{
          setSelectedLanguage("Spanish");
          fetchChooseLanguage("Spanish");
        }}
      >
        <Text style={styles.fieldTxt}>Spanish</Text>
        <Image
          source={
            selectedLanguage === "Spanish"
              ? images.selectRadioBtn
              : images.subtract
          }
          style={styles.allIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Language;

const styles = StyleSheet.create({
  fieldCont: {
    marginTop: "5%",
    height: height / 16,
    width: width - 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#c9c9c9",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  fieldTxt: {
    color: "#000",
    fontSize: width / 22,
  },
  allIcon: {
    height: 20,
    width: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: height / 20,
    marginVertical: "4%",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 18,
    fontWeight: "600",
  },
});
