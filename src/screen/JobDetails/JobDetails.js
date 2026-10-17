import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import images from "../../assets/images";
import { globalColor } from "../../Components/Color/GlobalColor";
import { base, imgURL } from "../../Api/Constants";
import { apiGet, apiPost } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { tw } from "../../utils/styling";

const { height, width } = Dimensions.get("window");
const JobDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const jobId = route.params?.jobId;

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState("")
  const [senderId, setSenderId] = useState("")

  useEffect(() => {
    const loadSession = async () => {
      const storedRole = await AsyncStorage.getItem("roleId");
      const storedUser = await AsyncStorage.getItem("userID");
      setRoleId(storedRole);
      setSenderId(storedUser);
    };
    loadSession();
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await apiGet(`${base.findServiceById}/${jobId}`);

      if (response.status === 200) {
        setJobDetails(response.data?.data || response.data);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    try {
      const response = await apiPost(base.cancelBooking, {
        booking_id: jobId,
        reason: "Change of mind",
      });
      if (response.status === 200) {
        console.log("resposne on request screen========", response.data);

      } else {
        Alert.alert(
          "Error",
          `Unexpected response: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };
  const statusUpdateApi = async (status) => {
    try {
      const response = await apiPost(base.updateBookingStatusByEmployee, {
        booking_id: jobId,
        booking_status: status,
      });
      if (response.status === 201 || response.status === 200) {
        navigation.navigate("JobDone", { jobId });

      } else {
        Alert.alert(
          "Error",
          `Unexpected response: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  function convertTo12Hour(time24) {
    if (!time24 || typeof time24 !== "string") {
      return "";
    }
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    if (Number.isNaN(hours)) {
      return time24;
    }
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  const attachments = Array.isArray(jobDetails?.booking_attachment)
    ? jobDetails.booking_attachment
    : [];
  const beforeServiceImages = attachments.filter(
    (att) => att?.title === "BEFORE SERVICE"
  );
  const afterServiceImages = attachments.filter(
    (att) => att?.title === "AFTER SERVICE"
  );
  return (
    <SafeAreaView style={{ paddingHorizontal: "5%", backgroundColor: "#fff", flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",

            height: height / 13,
          }}
        >
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={images.back} style={styles.headerBackBtn} />
          </TouchableOpacity>
          <Text style={styles.titleTxt}>Job Details</Text>
        </View>
        <View style={styles.jobDtls}>
          <View style={styles.status}>
            <Text style={styles.TaskContTxt1}>{jobDetails?.booking_status || "N/A"}</Text>
          </View>
          <Text style={styles.titleName}>{jobDetails?.service_booking?.name || "N/A"}</Text>
          {jobDetails?.time != null &&
            <Text
              style={[styles.titleName, { fontSize: width / 30, fontWeight: 500 }]}
            >

              {moment(jobDetails?.date).format('DD MMM')} | {convertTo12Hour(jobDetails.time)}
            </Text>
          }
        </View>
        <Text
          style={{
            color: "#000",
            fontSize: width / 22,
            fontWeight: "600",
            marginTop: "5%",
            marginHorizontal: 20

          }}
        >
          Notes
        </Text>
        <Text style={{
          marginHorizontal: 20
          , color: "#000", marginTop: "1%", lineHeight: (width / 22) * 1.5,
        }}>
          {jobDetails?.notes || "No notes available"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "5%",
            marginHorizontal: 20

          }}
        >
          <Text
            style={{ color: "#000", fontSize: width / 22, fontWeight: "600" }}
          >
            Service Location
          </Text>

        </View>
        <Text style={{
          color: "#000", marginTop: "2%",
          marginHorizontal: 20

        }}>
          {[
            jobDetails?.booking_address?.address,
            jobDetails?.booking_address?.user_city?.name,
            jobDetails?.booking_address?.user_state?.name,
            jobDetails?.booking_address?.user_country?.name,
          ]
            .filter(Boolean)
            .join(", ") || "N/A"}
        </Text>

        <View>
          <Text style={[tw`text-m font-semibold text-black mt-3`, { marginLeft: 20 }]}>
            Executive Assigned
          </Text>
          <View style={[tw`border rounded-lg  py-3 px-3  mt-3 flex-row items-center gap-3`, { borderColor: "#ECECEC", width: '90%', alignSelf: 'center' }]}>
            <Image source={images.UserFade} style={{ height: 40, width: 40 }} />
            <Text style={tw`text-neutral-600 text-[14px]  text-black`}>
              {jobDetails?.bdm_details?.name || "N/A"}
            </Text>
          </View>
        </View>
        {beforeServiceImages?.length > 0 &&

          <Text
            style={{ color: "#000", fontSize: width / 22, fontWeight: "600", marginHorizontal: 20, marginTop: 20 }}
          >
            Before Service
          </Text>
        }
        {beforeServiceImages?.length > 0 &&
          <View style={styles.imageGrid}>
            {beforeServiceImages.map((uri, index) => (
              <View key={index} style={styles.BoxImages}>
                <Image
                  source={{ uri: imgURL + uri.file_name }}
                  style={{ height: "100%", width: "100%", borderRadius: 20 }}
                />
              </View>
            ))}
          </View>}
        {afterServiceImages?.length > 0 &&

          <Text
            style={{ color: "#000", fontSize: width / 22, fontWeight: "600", marginHorizontal: 20, marginTop: 20 }}
          >
            After Service
          </Text>
        }
        {afterServiceImages?.length > 0 &&
          <View style={styles.imageGrid}>
            {afterServiceImages.map((uri, index) => (
              <View key={index} style={styles.BoxImages}>

                <Image
                  source={{ uri: imgURL + uri.file_name }}
                  style={{ height: "100%", width: "100%", borderRadius: 20 }}
                />

              </View>
            ))}
          </View>}
        <View style={styles.actionContainer}>
          {roleId === "7" && jobDetails?.booking_status === 'ACCEPTED' &&
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => statusUpdateApi('ONGOING')}
            >
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
              >
                <View style={styles.chidLeaveBtn}>
                  <Text style={styles.buttonText1}>Start Service</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          }

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  jobDtls: {
    borderRadius: 8,
    borderColor: "#ECECEC",

    height: height / 8,

    borderWidth: 1,

    justifyContent: "center",

    paddingHorizontal: "4%",
    marginHorizontal: 20
  },
  titleTxt: {
    fontSize: width / 23,
    color: "#432C1F",
    fontWeight: "700",

  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    height: height / 13,
  },
  headerBackBtn: {
    height: height / 50,
    width: width / 20,
    position: "absolute",
    left: "3%",
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
    fontSize: width / 28,
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

    padding: 15,
    justifyContent: "center",
    alignItems: "center",

  },
  addimgeBtn: {
    height: height / 20,
  },
  Canclebutton: {
    borderRadius: 30,
    marginTop: "5%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: globalColor.lightRed,
  },

  buttonText2: {
    fontWeight: "600",
    color: "#fff",
    color: globalColor.lightRed,
  },

  buttonText: { fontSize: width / 24, fontWeight: "700", color: "#fff" },
  buttonText1: { fontWeight: "500", color: "#fff", fontSize: width / 24 },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: "3%",
    marginLeft: 10
  },
  BoxImages: {
    height: height / 9,
    width: width / 3.6,
    borderRadius: 20,
    backgroundColor: "#c9c9c9",
    margin: "1%",
    marginHorizontal: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContainer: {
    width: "100%",
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});
