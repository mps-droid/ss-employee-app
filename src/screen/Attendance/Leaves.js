import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import images from "../../assets/images";
import moment from "moment";
import {
  cancleUserbooking,
  getallUserBookingByStatus,
} from "../../ApiHandling/NewFormate/ApiFunction";
import { randomdata } from "../../Components/RandomData";
import { apiGet } from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";
const { height, width } = Dimensions.get("window");

const PendingWork = [
  {
    status: "UpComming",
    Task: "Due to Health issue",
    dateTime: "30 Sep | 9:00 pm",
    reason: "sick Leave",
  },
  {
    status: "Pending",
    Task: "Due to Health issue",
    dateTime: "30 Sep | 9:00 pm",
    reason: "sick Leave",
  },
  {
    status: "UpComming",
    Task: "Due to Health issue",
    dateTime: "30 Sep | 9:00 pm",
    reason: "sick Leave",
  },
];

const JobDetails = () => {
  const [bookingData, setbookingData] = useState([]);
  const [bookingStatus, setbookingStatus] = useState("false");
  const [loader, setLoader] = useState(true)

  const navigation = useNavigation();
  const getAllUserLeaves = async () => {
    setLoader(true)
    try {
      const response = await apiGet(base.getAllUserLeaves);
      console.log("~🎈~ response from leaves screen ", response);

      if (response.status == 200) {
        setLoader(false)
        setbookingData(Array.isArray(response.data?.data) ? response.data.data : []);
        setbookingStatus("");
        console.log("LEAVES STORED ON THIS SCREEN ========", response.data);
      } else {
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log("Error in Profile Screen", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllUserLeaves()
    }, [])
  )

  return (
    <SafeAreaView style={{ paddingHorizontal: "5%", backgroundColor: "#fff", flex: 1 }}>
      {loader ?
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size={'large'} color={'#000'}/>
      </View>
      :
     <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: "absolute", left: 10, alignSelf: "center", color: "black" }}
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
          Leaves
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {bookingData?.length > 0 ?
          <FlatList

            showsVerticalScrollIndicator={false}
            data={bookingData || []}
            style={{

              height: height / 10,
              marginBottom: "1%",
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.jobDtls}
                onLongPress={() => console.log("delete booking")}
              >
                <Image source={images.threeDot} style={[styles.threeDotIcon, { height: 24, width: 24 }]} />
                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        item.leave_status == "PENDING"
                          ? "#E9B21A" : item.leave_status == "ACCEPTED" ? "#67B870" : "red",
                    },
                  ]}
                >
                  <Text style={styles.TaskContTxt1}>{item?.leave_status}</Text>
                </View>
                <Text style={styles.titleName}>
                  {item.leave_reason}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <Image
                    source={images.calendarColor}
                    style={{
                      height: 17,
                      width: 17,
                      alignSelf: "center",
                      marginRight: "2%",
                    }}
                  />
                  <Text
                    style={[
                      styles.titleName,
                      { fontSize: width / 30, fontWeight: 500 },
                    ]}
                  >
                    {moment(item?.leave_date).format('DD MMM YYYY')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#000' }}>No Leaves Found</Text>
          </View>
        }
        <View style={{ position: "relative", bottom: "2%" }}>
          <TouchableOpacity
            style={styles.LeaveBtn}
            onPress={() => navigation.navigate("ApplyLeave")}
          >
            <Text style={styles.buttonText2}>Add Leave</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
}
    </SafeAreaView>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  jobDtls: {
    borderRadius: 10,
    borderColor: "#ECECEC",

    height: height / 8,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: "4%",

    marginBottom: "4%",
    marginHorizontal: 20
  },
  titleTxt: {
    fontSize: width / 18,
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
    marginBottom: "2%",
  },
  TaskContTxt1: {
    fontSize: width / 33,
    color: "#fff",
  },
  titleName: {
    fontSize: width / 25,
    color: "#000",
    fontWeight: "700",
  },
  underTitle: {
    fontSize: width / 30,
    color: "#6B6B6B",
    fontWeight: "400",
    marginBottom: "1%",
  },

  LeaveBtn: {
    borderRadius: 30,
    marginTop: "5%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#212121",
    marginHorizontal: 20
  },
  buttonText2: { fontWeight: "600", color: "#212121", fontSize: width / 25 },

  buttonText: { fontSize: width / 25, fontWeight: "700" },
  threeDotIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: height / 20,
    marginVertical: "4%",
    justifyContent: "center",
  },
  HeaderTitleTxt: {
    color: "#000",
    fontSize: width / 22,
    marginHorizontal: "6%",
    fontWeight: "600",
  },
});
