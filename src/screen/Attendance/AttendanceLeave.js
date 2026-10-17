import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("window");
const AttendanceLeave = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.MainContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={{}}>
        <View style={styles.HomeContainer}>

          <View style={styles.HeaderContainer}>
            <Text style={[styles.topHeadingTxt, { marginTop: "8%" }]}>
              My Attendance
            </Text>
            <Text
              style={[
                styles.topHeadingTxt,
                { fontSize: 13, fontWeight: "400", marginTop: 20 },
              ]}
            >
              30 Dec 24
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.topHeadingTxt,
                  { fontSize: 20, fontWeight: "500" },
                ]}
              >
                You are clocked in
              </Text>
              <Text
                style={[
                  styles.topHeadingTxt,
                  {
                    fontSize: 20,
                    fontWeight: "500",
                    position: "absolute",
                    right: 10,
                  },
                ]}
              >
                00:00 hr
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-around",
              paddingHorizontal: "5%",
              marginTop: "10%",
            }}
          >

            <TouchableOpacity
              style={styles.leave}
              onPress={() => {
                console.log("Clock In");
              }}
            >
              <Text style={styles.buttonText}>CLOCK IN</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradient}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("JobDetails")}
              >
                <Text style={styles.buttonText}>LEAVES</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <Text style={styles.historyTxt}>Attendance history</Text>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.TaskCont}>
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                paddingVertical: "2%",
                marginBottom: "2%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: "5%",
              }}
            >
              <View
                style={{ flex: 2, backgroundColor: "#ffff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>30 Sept | 9:00 Pm</Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "800",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 hours
                </Text>
              </View>
              <View
                style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
              >
                <Text style={{ color: "#000" }}>In & Out </Text>
                <Text
                  style={{
                    color: "#212121",
                    fontWeight: "700",
                    fontSize: width / 20,
                    marginTop: "5%",
                  }}
                >
                  9:00 AM 6:00 PM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceLeave;

const styles = StyleSheet.create({
  topHeadingTxt: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",

    paddingLeft: 10,
  },
  MainContainer: { backgroundColor: "#fff", flex: 1 },
  HeaderContainer: {
    height: height / 9,
    width: width,
    paddingHorizontal: "5%",
  },
  Logo: {
    height: "100%",
    width: "20%",
  },

  taskContainer: {
    height: height / 15,
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
  leave: {
    borderRadius: 30,
    height: 45,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DF5A5A",
  },
  linearGradient: {
    borderRadius: 30,
    height: 45,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "500", color: "#fff", fontSize: width / 25 },

  searchTxt: { fontSize: width / 22, paddingHorizontal: 20 },
  TaskCont: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ECECEC",
    height: height / 10,
    width: width - 50,

    alignSelf: "center",
    marginTop: "3%",
    paddingHorizontal: "2%",
    paddingHorizontal: "5%",

  },
  TaskContTxt1: {
    fontSize: width / 28,
    color: "#fff",
  },
  TaskContTxt2: {
    fontSize: width / 22,
    color: "#000",
    fontWeight: "600",
  },
  TaskContDetails: {
    fontSize: width / 28,
    color: "#000",
  },
  historyTxt: {
    color: "#000",
    fontSize: 16,
    paddingLeft: "7%",
    marginTop: "4%",
  },
});
