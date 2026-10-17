import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import images from "../../assets/images";
import ApiService from "../../ApiServices/ApiService";
import { base, mainURL } from "../../Api/Constants";

const API_ORIGIN = mainURL.split("/api/")[0];

const { height, width } = Dimensions.get("window");
const JobDetaileCompleted = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log("Route params===:", route.params);
  const jobId = route.params?.jobDetails?.id || route.params?.jobId;

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      console.log("Received jobId:", jobId);
      const payload = await ApiService.get(`${base.findServiceById}/${jobId}`);
      const details = payload?.data || payload;
      if (details) {
        setJobDetails(details);
      } else {
        console.error("Unexpected response format:", payload);
      }
    } catch (error) {
      console.error("API Error:", error);

    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ paddingHorizontal: "5%", backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: "absolute", left: 20, alignSelf: "center" }}
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
        <Text style={[styles.HeaderTitleTxt, { alignSelf: "center" }]}>
          Job Details
        </Text>
      </View>

      <View style={styles.jobDtls}>
        <View style={styles.status}>
          <Text style={styles.TaskContTxt1}>{jobDetails?.status || "N/A"}</Text>
        </View>
        <Text style={styles.titleName}>{jobDetails?.name || "N/A"}</Text>
        <Text
          style={[styles.titleName, { fontSize: width / 30, fontWeight: 500 }]}
        >
          {jobDetails?.created_at}
        </Text>
      </View>
      <Text
        style={{
          color: "#000",
          fontSize: width / 26,
          fontWeight: "600",
          marginTop: "5%",
        }}
      >
        Notes
      </Text>
      <Text style={{ color: "#000", marginTop: "3%",lineHeight: (width / 22) * 1.5, }}>
      {jobDetails?.description}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "5%",
        }}
      >
        <Text
          style={{ color: "#000", fontSize: width / 26, fontWeight: "600" }}
        >
          Service Location
        </Text>

      </View>
      <Text style={{ color: "#000", marginVertical: "2%",lineHeight: (width / 22) * 1.5, }}>
        A/78 Street park avenue villa vacation transaction and how to generated
        3345777
      </Text>
      <Text style={{ color: "#000", fontSize: width / 26, fontWeight: "600" }}>
        Upload Images
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          marginTop: "3%",
          borderRadius: 20,

        }}
      >

        {jobDetails?.service_attachments?.length > 0 ? (
  jobDetails.service_attachments.map((attachment, index) => {
    console.log("File URI:", attachment.file_uri);
    console.log("File Name:", attachment.file_name);
    console.log("Full Image URL:", `${API_ORIGIN}${attachment.file_uri}/${attachment.file_name}`);

    return (
      <View key={index} style={[styles.BoxImages, { borderRadius: 20, overflow: "hidden" }]}>
        <Image
          source={{ uri: `${API_ORIGIN}${attachment.file_uri}/${attachment.file_name}` }}
          style={{ height: "100%", width: "100%" }}
          onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
        />
      </View>
    );
  })
) : (
  <Text style={{ color: "#000" }}>No images uploaded</Text>
)}

      </View>
    </SafeAreaView>
  );
};

export default JobDetaileCompleted;

const styles = StyleSheet.create({
  jobDtls: {
    borderRadius: 10,
    borderColor: "#ECECEC",

    height: height / 8,

    borderWidth: 1,

    justifyContent: "center",

    paddingHorizontal: "4%",

  },
  titleTxt: {
    fontSize: width / 16,
    color: "#432C1F",
    fontWeight: "700",
    alignSelf: "center",
    marginTop: "8%",
    marginBottom: "4%",
  },
  status: {
    borderRadius: 30,
    backgroundColor: "#67B870",
    padding: "1%",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  TaskContTxt1: {
    fontSize: width / 32,
    color: "#fff",
  },
  titleName: {
    fontSize: width / 25,
    color: "#000",
    fontWeight: "700",

    marginTop: "2%",
  },
  linearGradient: {
    borderRadius: 30,
    marginTop: "10%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  Canclebutton: {
    borderRadius: 30,
    marginTop: "3%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E96565",
  },
  buttonText2: { fontWeight: "600", color: "#E96565" },

  buttonText3: { fontSize: width / 25, fontWeight: "700", color: "#fff" },
  buttonText: { fontSize: width / 25, fontWeight: "400", color: "#000" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    height: height / 20,

    marginTop: "4%",

    justifyContent: "center",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 22,
    marginHorizontal: "6%",
    fontWeight: "600",
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
