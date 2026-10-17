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
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import images from "../../assets/images";
import { base, imgURL } from "../../Api/Constants";
import { apiGet, apiPost } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { tw } from "../../utils/styling";
const { height, width } = Dimensions.get("window");
const JobDone = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const jobId = route.params?.jobId;
  console.log(jobId);

  const [roleID, setRoleID] = useState("")
  const [jobDetails, setJobDetails] = useState(null);
  const [senderId,setSenderId] = useState("")

  useEffect(() => {
    const roleHandler = async () => {

      const roleId = await AsyncStorage.getItem("roleId");
      const userid = await AsyncStorage.getItem("userID");
      setRoleID(roleId)
      setSenderId(userid)
    }
    roleHandler()
  }, [])

  useEffect(() => {
    console.log(jobId, "-=-=jobid");

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
    }
  };

  const attachments = Array.isArray(jobDetails?.booking_attachment)
    ? jobDetails.booking_attachment
    : [];
  const beforeServiceImages = attachments.filter(
    (att) => att?.title === "BEFORE SERVICE"
  );
  const afterServiceImages = attachments.filter(
    (att) => att?.title === "AFTER SERVICE"
  );

  const jobCompleted = async (id) => {
    try {
      const response = await apiPost(base.updateBookingStatusByEmployee, {
        booking_id: id,
        booking_status: "SUCCESS",
      });

      if (response.status === 201 || response.status === 200) {
        navigation.navigate("CompleteJob");

      } else {
        Alert.alert("Error", `Unexpected response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("API Error:", error.message);
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

  return (
    <SafeAreaView style={{ paddingHorizontal: "5%", backgroundColor: "#fff", flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",

            height: height / 13,
          }}
        >
          <TouchableOpacity
            style={[styles.headerBackBtn]}
            onPress={() => navigation.goBack()}
          >
            <Image source={images.back} style={styles.headerBackBtn} />
          </TouchableOpacity>
          <Text style={styles.titleTxt}>Job Details</Text>
        </View>
        <View style={[styles.jobDtls, { borderRadius: 10, marginHorizontal: 20 }]}>
          <View style={[styles.status, { backgroundColor: jobDetails?.booking_status === "ONGOING" ? "#E9B21A" : "#67B870" }]}>
            <Text style={styles.TaskContTxt1}>{jobDetails?.booking_status || "N/A"}</Text>
          </View>
          <Text style={styles.titleName}>{jobDetails?.service_booking?.name}</Text>
          {jobDetails != null && jobDetails?.time !== null &&
            <Text
              style={[styles.titleName, { fontSize: width / 30, fontWeight: 500 }]}
            >
              {moment(jobDetails?.date).format('DD MMM')} | {convertTo12Hour(jobDetails?.time)}

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
        <Text style={{ color: "#000", marginHorizontal: 20, marginTop: "1%", lineHeight: (width / 22) * 1.5, textAlign: 'justify' }}>
          {jobDetails?.notes}
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
        <Text style={{ color: "#000", marginTop: "2%", marginHorizontal: 20 }}>
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
          <Text style={[tw`text-m font-semibold text-black mt-5`, { marginLeft: 20 }]}>
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

          {roleID === "8" &&
            <TouchableOpacity
              style={[
                styles.linearGradient,
                { borderColor: "#ECECEC", borderWidth: 1 },
              ]}
              onPress={() => navigation.navigate("CheckList", { jobId: jobId })}
            >
              <Text style={styles.buttonText}>CheckList </Text>
              <Image
                source={images.forword}
                style={{ position: "absolute", right: "5%" }}
              />
            </TouchableOpacity>
          }
          {roleID === "7" &&
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AddImages", { jobId: jobId })}
            >
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: height / 18,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",

                  marginTop: "2%",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    width: "99%",
                    borderRadius: 30,
                    height: "90%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      fontWeight: "600",
                      alignSelf: "center",
                      fontSize: width / 25,
                    }}
                  >
                    Add Images
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          }
          {roleID === "7" &&

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => jobCompleted(jobDetails?.id)}
            >
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.linearGradient, { marginTop: "2%" }]}
              >
                <Text style={styles.buttonText3}>Job Completed</Text>
              </LinearGradient>
            </TouchableOpacity>

          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDone;

const styles = StyleSheet.create({
  jobDtls: {
    borderRadius: 1,
    borderColor: "#ECECEC",

    height: height / 8,

    borderWidth: 1,

    justifyContent: "center",

    paddingHorizontal: "4%",
  },
  titleTxt: {
    fontSize: width / 25,
    color: "#432C1F",
    fontWeight: "700",
    alignSelf: "center",

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
  headerBackBtn: {
    height: height / 50,
    width: width / 20,
    position: "absolute",
    left: "3%",
  },
  buttonText1: { fontWeight: "500", color: "#000", fontSize: width / 24 },
  chidLeaveBtn: {
    height: "97%",
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: "3%",
    marginLeft: 10
  },
  BoxImages: {
    height: height / 9,
    width: width / 4,
    borderRadius: 20,
    backgroundColor: "#c9c9c9",
    margin: "1%",
    marginHorizontal: '2%',
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
