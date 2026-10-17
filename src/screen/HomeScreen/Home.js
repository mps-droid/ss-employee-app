import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { base, imgURL } from "../../Api/Constants";
import { apiGet, apiPost, isUnauthorizedError } from "../../ApiServices/ApiService";
import moment from "moment";
const { height, width } = Dimensions.get("window");
const Home = () => {
  const navigation = useNavigation();
  const [ApiServices, setApiServices] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Upcoming");
  const [filteredData, setFilteredData] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [completCount, setCompleteCount] = useState(0);
  const [scheduleError, setScheduleError] = useState("");

  const extractBookingList = (payload) => {
    if (Array.isArray(payload)) {
      return payload.filter((item) => item && typeof item === "object");
    }
    if (Array.isArray(payload?.rows)) {
      return payload.rows.filter((item) => item && typeof item === "object");
    }
    if (Array.isArray(payload?.bookings)) {
      return payload.bookings.filter((item) => item && typeof item === "object");
    }
    if (Array.isArray(payload?.data)) {
      return payload.data.filter((item) => item && typeof item === "object");
    }
    return [];
  };

  const getBookingAttachments = (item) => {
    if (Array.isArray(item?.service_attachments) && item.service_attachments.length) {
      return item.service_attachments;
    }
    if (
      Array.isArray(item?.service_booking?.service_attachments) &&
      item.service_booking.service_attachments.length
    ) {
      return item.service_booking.service_attachments;
    }
    if (Array.isArray(item?.booking_attachment) && item.booking_attachment.length) {
      return item.booking_attachment;
    }
    return [];
  };

  const getAttachmentUri = (attachment) => {
    if (!attachment) {
      return null;
    }
    const fileName = attachment.file_name || attachment.fileName;
    if (!fileName) {
      return null;
    }
    if (String(fileName).startsWith("http")) {
      return fileName;
    }
    return `${imgURL}${fileName}`;
  };

  const applySearch = (list, text) => {
    if (!text) {
      return list;
    }
    const query = text.toLowerCase();
    return list.filter((item) =>
      item?.service_booking?.name?.toLowerCase().includes(query) ||
      item?.booking_name?.toLowerCase().includes(query)
    );
  };

  const handleSearch = (text) => {
    setSearch(text);
    setFilteredData(applySearch(ApiServices, text));
  };

  const homeHandling = async (status) => {
    setLoading(true);
    setScheduleError("");
    try {
      const response = await apiPost(base.getAllEmployeBooking, {
        booking_status: status === "Upcoming" ? "UPCOMING" : "COMPLETED",
      });

      if (response.status == 200 && response.data?.success !== false) {
        const list = extractBookingList(response.data?.data);
        setApiServices(list);
        setFilteredData(applySearch(list, search));
      } else {
        setApiServices([]);
        setFilteredData([]);
        setScheduleError(response.data?.message || "Unable to load schedule.");
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setApiServices([]);
        setFilteredData([]);
        setScheduleError("Session expired. Please login again.");
        return;
      }
      setApiServices([]);
      setFilteredData([]);
      setScheduleError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load schedule."
      );
    } finally {
      setLoading(false);
    }
  };
  const completedBookingApi = async () => {
    try {
      const response = await apiGet(base.completedBooking);
      if (response.status == 200) {
        setCompleteCount(response.data?.data?.count || 0);
      }
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        console.log(error, "complete");
      }
    }
  };

  const todayBookingApi = async () => {
    try {
      const response = await apiGet(base.todayBooking);
      if (response.status == 200) {
        setTodayCount(response.data?.data?.count || 0);
      }
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        console.error("API Error:", error.response?.data || error.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      homeHandling('Upcoming');
      todayBookingApi()
      completedBookingApi()
      setSelectedTab('Upcoming')
    }, [])
  );

  function convertTo12Hour(time24) {
    if (!time24 || typeof time24 !== "string") {
      return "";
    }
    const parts = time24.split(":");
    if (parts.length < 2) {
      return time24;
    }
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (Number.isNaN(hours)) {
      return time24;
    }
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <SafeAreaView style={styles.MainContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={{}} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.HomeContainer}>

          <View style={styles.HeaderContainer}>
            <Image source={images.LogoSanitation} style={styles.Logo} />
            <TouchableOpacity
              style={{ marginTop: "5%" }}
              onPress={() => {
                navigation.navigate("Notification");
              }}
            >
              <Image source={images.notification} style={styles.notification} />
            </TouchableOpacity>

          </View>

          <View style={styles.TopBar}>
            <View style={styles.TopBox1}>
              <Text style={styles.boxTitle}>Today's</Text>
              <Text
                style={[
                  styles.boxTitle,
                  { fontWeight: "800", color: "#000", fontSize: width / 25 },
                ]}
              >
                {todayCount}
              </Text>
            </View>
            <View style={styles.TopBox2}>
              <Text style={styles.boxTitle}>Completed</Text>
              <Text
                style={[
                  styles.boxTitle,
                  { fontWeight: "800", color: "#000", fontSize: width / 25 },
                ]}
              >
                {completCount}
              </Text>
            </View>
          </View>
          <View style={styles.taskContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => {
                setSelectedTab("Upcoming")
                homeHandling('Upcoming');
                todayBookingApi()
                completedBookingApi()
              }}
            >
              {selectedTab == 'Upcoming' ? (
                <LinearGradient
                  colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.linearGradient}
                >
                  <Text style={styles.buttonText}>Upcoming</Text>
                </LinearGradient>
              ) : (
                <View style={{ marginLeft: "10%" }}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: "#000", fontWeight: "400" },
                    ]}
                  >
                    Upcoming
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: "10%" }}
              onPress={() => {
                if (selectedTab !== "Completed") {
                  homeHandling('completed')
                  setSelectedTab("Completed");
                  setSelected("Completed")
                  todayBookingApi()
                  completedBookingApi()
                }
              }}>
              {selectedTab == 'Completed' ? (
                <LinearGradient
                  colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.linearGradient}
                >
                  <Text style={styles.buttonText}>Completed</Text>
                </LinearGradient>
              ) : (
                <View style={{}}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: "#000", fontWeight: "400" },
                    ]}
                  >
                    Completed
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search"
              placeholderTextColor={"#8F8F8F"}
              style={styles.searchTxt}
              value={search}
              onChangeText={handleSearch}
            />
          </View>
          {loading ? (
            <View style={{ marginTop: 80, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#243352" />
              <Text style={{ textAlign: "center", marginTop: 12, fontSize: 16, color: "gray" }}>
                Loading schedule...
              </Text>
            </View>
          ) : scheduleError ? (
            <View style={{ marginTop: 80, alignItems: "center", paddingHorizontal: 24 }}>
              <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
                {scheduleError}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  homeHandling(selectedTab);
                  todayBookingApi();
                  completedBookingApi();
                }}
                style={{ marginTop: 16 }}
              >
                <Text style={{ color: "#243352", fontWeight: "600" }}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredData.length > 0 ? (
            filteredData.filter((item) => item && typeof item === "object").map((item, index) => {
              const attachments = getBookingAttachments(item);
              const imageUri = getAttachmentUri(attachments[0]);
              const status = item?.booking_status || "";
              return (
              <TouchableOpacity
                key={item?.id?.toString() || `booking-${index}`}
                style={styles.TaskCont}
                onPress={() =>
                  status == "ACCEPTED" || status == "SUCCESS"
                    ? navigation.navigate("JobDetails", { jobId: item.id })
                    : navigation.navigate("JobDone", { jobId: item.id })
                }
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.serviceImage}
                  />
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: "2%",
                  }}
                >
                  <View
                    style={{
                      borderRadius: 30,
                      backgroundColor:
                        status == "ACCEPTED"
                          ? "#2391B1"
                          : status == "SUCCESS"
                          ? "#67B870"
                          : "#E9B21A",
                      padding: "1%",
                      width: "35%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.TaskContTxt1}>{status || "N/A"}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.TaskContDetails,
                    { fontWeight: "700", fontSize: width / 25 },
                  ]}
                >
                  {item?.service_booking?.name || item?.booking_name || "Untitled"}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Image
                    source={images.calendarColor}
                    style={{ height: 12, width: 12, marginRight: 10 }}
                  />
                  <Text style={[styles.TaskContDetails, { color: "gray" }]}>
                    {item?.date && moment(item.date).isValid()
                      ? moment(item.date).format("DD MMM")
                      : ""}
                    {item?.time ? ` | ${convertTo12Hour(item.time)}` : ""}
                  </Text>
                </View>
              </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 120, fontSize: 16, color: "gray" }}>
              No booking found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  MainContainer: { backgroundColor: "#fff", flex: 1 },
  notification: { height: 50, width: 50 },
  HeaderContainer: {
    height: height / 9,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
  },
  Logo: {
    height: "100%",
    width: "20%",
  },
  TopBar: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "space-evenly",
  },
  TopBox1: {
    height: height / 13,
    width: width / 2.5,
    backgroundColor: "#FFFAF1",
    borderColor: "#DA971F",
    borderLeftWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
  },
  TopBox2: {
    height: height / 13,
    width: width / 2.5,
    backgroundColor: "#F1F7F2",
    borderColor: "#13AA36",
    borderLeftWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
  },
  boxTitle: {
    color: "#6B6B6B",
    fontSize: 13,
    paddingHorizontal: "10%",
    fontWeight: "300",
  },
  taskContainer: {
    height: 50,
    borderRadius: 40,
    borderColor: "#ECECEC",
    borderWidth: 1,
    marginTop: "5%",
    width: width - 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "1%",
    paddingVertical: "1%",
  },
  InnertaskContainer: {
    height: "90%",
    borderRadius: 40,
    borderColor: "#ECECECy",
    borderWidth: 1,
    marginTop: height / 10,
    width: width - 40,
    alignSelf: "center",

  },
  HomeContainer: {},
  linearGradient: {
    borderRadius: 30,
    height: "100%",
    width: width / 2,

    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "500", color: "#fff", fontSize: width / 22 },
  searchBar: {
    borderRadius: 42,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ECECEC",
    height: height / 18,
    width: width - 50,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "3%",
  },
  searchTxt: { fontSize: width / 22, paddingHorizontal: 20 },
  TaskCont: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ECECEC",
    width: width - 50,
    alignSelf: "center",
    marginTop: "3%",
    paddingHorizontal: "2%",
    paddingHorizontal: "5%",
    paddingVertical: 6
  },
  TaskContTxt1: {
    fontSize: width / 28,
    color: "#fff",
  },
  TaskContTxt2: {
    fontSize: width / 25,
    color: "#000",
    fontWeight: "600",
  },
  TaskContDetails: {
    fontSize: width / 28,
    color: "#000",
  },
  serviceImage: {
    height: 140,
    width: "100%",
    borderRadius: 8,
    marginTop: 6,
    resizeMode: "cover",
  },
  titleName: { fontSize: width / 15, color: "#000" },
});
