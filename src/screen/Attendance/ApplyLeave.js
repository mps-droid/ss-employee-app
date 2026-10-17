import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { base } from "../../Api/Constants";
import { postFormData } from "../../ApiServices/ApiService";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const ApplyLeave = () => {
  const navigation = useNavigation();

  const [selectedValue, setSelectedValue] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setselectedDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const HideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date) => {

    const gettingDate = moment(date).format("DD MMM YYYY");
    setStartDate(date);
    hideDatePicker();
  };

  const HandleTimeConfirm = (time) => {
    setSelectedTime(time);
    setEndDate(time)
    HideTimePicker();
  };

  const applyLeave = async () => {
    if(leaveReason === ""){
      Toast.show({type:'error',text1:"Please provide reason!"})
    }else{
    try {
      const response = await postFormData(base.applyForLeave, {
        leave_reason: leaveReason,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      });

      if (response.status == 201 || response.status == 200) {
        setLeaveReason("");
        Toast.show({ type: "success", text1: "Leave applied successfully" });
        navigation.goBack();
        console.log("🟢 Leave applied successfully:", response.data);
      }
    } catch (error) {
      Toast.show({type:'error',text1:error.response?.data?.message || "Unable to apply leave" })
      console.log(
        "❌ Error applying leave:",error.response?.data || error.message
      );
    }
  }
  };

  return (
    <SafeAreaView style={{ padding: "1%", backgroundColor: "#fff", flex: 1 }}>
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
          Apply Leave
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ marginHorizontal: 20 }}>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={startDate}
            minimumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            themeVariant="light"
            textColor="#000000"
          />
          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Start Date</Text>
            <View style={styles.InputBox}>

                              <Text style={styles.titleTxt}>{moment(startDate).format("YYYY-MM-DD")}</Text>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 20,
                  zIndex: 1,

                }}
                onPress={() => {
                  showDatePicker();
                }}
              >
                <Image source={images.calendar} style={{height:16,width:16}} />
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="date"
            date={endDate}
            minimumDate={startDate}
            onConfirm={HandleTimeConfirm}
            onCancel={HideTimePicker}
            themeVariant="light"
            textColor="#000000"
          />
          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>End Date</Text>
            <View style={styles.InputBox}>

                              <Text style={styles.titleTxt}>{moment(endDate).format("YYYY-MM-DD")}</Text>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 20,
                  zIndex: 1,

                }}
                onPress={() => {
                  showTimePicker();
                }}
              >
                <Image source={images.calendar} style={{height:16,width:16}} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldCont}>
            <Text style={styles.titleTxt}>Reason</Text>
            <View>
              <TextInput
              value={leaveReason}
              onChangeText={(e)=>setLeaveReason(e)}
                style={[
                  styles.InputBox,
                  {
                    height: height / 7,

                    textAlignVertical: "top",
                    paddingHorizontal:10,
                    paddingTop:10

                  },
                ]}
                multiline
                placeholder="Write your Reason here..."
                placeholderTextColor={"#929292"}
              />
            </View>
          </View>

        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.Applybutton}
        onPress={() => applyLeave()}
      >
        <LinearGradient
          colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
        >
          <Text style={styles.buttonText}>APPLY </Text>
        </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  LoginTxt1: {
    color: "#000",
    fontSize: width / 15,
    marginHorizontal: "6%",
  },
  LoginTxt2: {
    color: "#000",
    fontSize: width / 25,
    marginHorizontal: "6%",
  },
  AccountContainer: {

    width: width - 40,

    alignSelf: "center",

  },
  Logo: {
    height: 200,
    width: 200,
  },
  InputBox: {
    height: height / 18,

    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ECECEC",

    paddingLeft: 20,
    marginTop: "2%",
    color: "#000",
  },
  InputBoxTxt: { color: "#929292" },
  titleTxt: {
    color: "#000",
    fontWeight: "700",
  },
  fieldCont: {
    marginTop: "5%",

    justifyContent: "center",
  },
  LoginBtn: {
    height: height / 18,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: ["rgba(8, 246, 36, 1)", "rgba(36, 51, 82, 1)"],
    marginTop: "10%",
  },
  LoginBtnTxt: { color: "#000" },

  linearGradient: {
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    height: height / 15,
    width: width - 50,
    padding: 15,
  },
  buttonText: { fontWeight: "600", color: "#fff", fontSize: width / 22 },

  ForgotTxt: {
    fontSize: height / 60,
    color: "#000",
    alignSelf: "center",
    marginTop: "5%",
  },

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
  Applybutton: {
    width: width,
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 24,
  },
});
