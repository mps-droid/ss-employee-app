import {
  Alert,
  AppState,
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import React, { useState, useEffect, useRef } from "react";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { base } from "../../Api/Constants";
import { apiGet, isUnauthorizedError, postFormData } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import Geolocation from "@react-native-community/geolocation";

const { height, width } = Dimensions.get("window");

const attendanceTimming = [
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 AM - 6:00 PM",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
  {
    dataTime: " 30 Spet | pm",
    hours: " 9:00",
    fromto: "9:00 am - 6:00 pm",
  },
];

const Attendance = () => {
  const navigation = useNavigation();
  const [clockINOut, setclockINOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceList, setAttendanceList] = useState([])
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const getDefaultHistoryStart = () => moment().subtract(6, "months").toDate();
  const [selectedDate, setselectedDate] = useState(getDefaultHistoryStart());
  const [leaveReason, setLeaveReason] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startTime, setStartTime] = useState(null);

  const [intervalId, setIntervalId] = useState(null);
  const [totalTime, setTotalTime] = useState('00:00');

  const [selectedTime, setSelectedTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const clockInEpochRef = useRef(null);
  const clockInInFlight = useRef(false);
  const clockOutInFlight = useRef(false);
  const UPLOAD_TIMEOUT_MS = 60000;

  const getElapsedSeconds = (epochMs) => {
    if (!epochMs) {
      return 0;
    }
    return Math.max(0, Math.floor((Date.now() - epochMs) / 1000));
  };

  const parseClockInMs = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 1000000000000 && numeric <= Date.now() + 60000) {
      return numeric;
    }

    const raw = String(value).trim();
    const candidates = [];
    const iso = moment(raw);
    if (iso.isValid()) {
      candidates.push(iso.valueOf());
    }
    const stripped = raw.replace(/Z$/i, "").replace(/[+-]\d{2}:\d{2}$/, "");
    if (stripped !== raw) {
      const local = moment(stripped);
      if (local.isValid()) {
        candidates.push(local.valueOf());
      }
    }
    const formats = [
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSS",
    ];
    formats.forEach((format) => {
      const parsed = moment(raw, format, true);
      if (parsed.isValid()) {
        candidates.push(parsed.valueOf());
      }
    });

    const past = candidates.filter(
      (ms) => Number.isFinite(ms) && ms <= Date.now() + 2000
    );
    if (past.length) {
      return Math.max(...past);
    }
    return null;
  };

  const persistClockInEpoch = async (epochMs) => {
    if (!epochMs) {
      return;
    }
    await AsyncStorage.multiSet([
      ["clockInEpoch", String(epochMs)],
      ["clockInTime", new Date(epochMs).toISOString()],
    ]);
  };

  const readStoredClockInEpoch = async () => {
    const [epochPair, timePair] = await AsyncStorage.multiGet([
      "clockInEpoch",
      "clockInTime",
    ]);
    return (
      parseClockInMs(epochPair?.[1]) ||
      parseClockInMs(timePair?.[1]) ||
      clockInEpochRef.current
    );
  };

  const stopLocalTimer = async ({ clearStorage = true } = {}) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    clockInEpochRef.current = null;
    setElapsedTime(0);
    setClockedIn(false);
    if (clearStorage) {
      await AsyncStorage.multiRemove(["clockInTime", "clockInEpoch"]);
    }
  };

  const startTimer = (epochMs) => {
    const epoch = parseClockInMs(epochMs) || epochMs;
    if (!epoch || !Number.isFinite(epoch)) {
      return;
    }
    clockInEpochRef.current = epoch;
    setClockedIn(true);
    setElapsedTime(getElapsedSeconds(epoch));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!clockInEpochRef.current) {
        return;
      }
      setElapsedTime(getElapsedSeconds(clockInEpochRef.current));
    }, 1000);
  };

  const restoreTimerFromStorage = async () => {
    const storedEpoch = await readStoredClockInEpoch();
    if (storedEpoch) {
      startTimer(storedEpoch);
      return storedEpoch;
    }
    return null;
  };

  const loadClockInStatus = async () => {
    const storedEpoch = await restoreTimerFromStorage();
    try {
      const response = await apiGet(base.getClockInStatus);
      const statusData = response.data?.data || {};
      const isUserClockedIn = Boolean(
        statusData.isClockedIn ?? statusData.is_clocked_in
      );

      if (response.data?.success && isUserClockedIn) {
        const apiEpoch = parseClockInMs(
          statusData.clock_in_time ||
            statusData.clockInTime ||
            statusData.clock_in ||
            statusData.clockIn
        );
        const epochCandidates = [storedEpoch, apiEpoch, clockInEpochRef.current]
          .filter((ms) => Number.isFinite(ms) && ms <= Date.now() + 2000);
        const epoch = epochCandidates.length
          ? Math.min(...epochCandidates)
          : null;
        if (epoch) {
          await persistClockInEpoch(epoch);
          startTimer(epoch);
          return;
        }
        setClockedIn(true);
        return;
      }

      await stopLocalTimer();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await stopLocalTimer();
        return;
      }
      if (storedEpoch || clockInEpochRef.current) {
        startTimer(storedEpoch || clockInEpochRef.current);
        return;
      }
      console.log(
        "Clock-in status fallback:",
        error.response?.data || error.message
      );
    }
  };

  const fetchAttendanceData = async (start_date, end_date) => {
    setHistoryLoading(true);
    try {
      const response = await postFormData(base.getAttendance, {
        start_date,
        end_date,
      });

      const payload = response.data?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.rows)
        ? payload.rows
        : [];
      setAttendanceData(list);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setAttendanceData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const refreshAttendanceHistory = () => {
    fetchAttendanceData(
      moment(selectedDate).format("YYYY-MM-DD"),
      moment(selectedTime).format("YYYY-MM-DD")
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      loadClockInStatus();
      setDate(new Date());
      refreshAttendanceHistory();
    }, [selectedDate, selectedTime])
  );

  useEffect(() => {
    restoreTimerFromStorage();
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        if (clockInEpochRef.current) {
          startTimer(clockInEpochRef.current);
        }
        loadClockInStatus();
      }
    });
    return () => subscription.remove();
  }, []);

  const handleClockInOut = () => {
    setclockINOut(!clockINOut);
    {
      !clockINOut ? fetchClockInStatus() : fetchClockOutStatus()
    }
  };
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
    setselectedDate(date);
    hideDatePicker();
  };

  const HandleTimeConfirm = (time) => {
    setSelectedTime(time);
    HideTimePicker();
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getCurrentDateTime = () => moment().format("YYYY-MM-DD HH:mm:ss");

  const handleClockIn = async () => {
    const epoch = Date.now();
    await persistClockInEpoch(epoch);
    startTimer(epoch);
  };

  const handleClockOut = async () => {
    await stopLocalTimer();
  };

  const getAttendanceDate = (item) =>
    item?.clock_in_est || item?.clock_in || item?.created_at;

  const formatClockRange = (clockIn, clockOut) => {
    const inTime = clockIn ? moment(clockIn) : null;
    const outTime = clockOut ? moment(clockOut) : null;
    if (!inTime?.isValid()) {
      return "Invalid date";
    }
    const inFormatted = inTime.format("hh:mm A");
    if (!outTime?.isValid()) {
      return `${inFormatted} - Active`;
    }
    return `${inFormatted} - ${outTime.format("hh:mm A")}`;
  };

  const isApiSuccess = (status) => status === 200 || status === 201;

  const normalizeAttendanceImage = (asset) => {
    if (!asset?.uri) {
      return null;
    }
    let uri = String(asset.uri);
    if (Platform.OS === "ios" && uri.startsWith("/")) {
      uri = `file://${uri}`;
    }
    const rawName =
      asset.fileName ||
      uri.split("/").pop()?.split("?")[0] ||
      `attendance_${Date.now()}.jpg`;
    const safeName = rawName.replace(/\.(heic|heif)$/i, ".jpg");
    const name = /\.(jpe?g|png|webp)$/i.test(safeName)
      ? safeName
      : `${safeName}.jpg`;
    let type = asset.type || "image/jpeg";
    if (
      type === "image/jpg" ||
      type === "image/heic" ||
      type === "image/heif" ||
      type === "application/octet-stream"
    ) {
      type = "image/jpeg";
    }
    return { uri, name, type };
  };

  const getCoordinates = () =>
    new Promise((resolve) => {
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: String(position?.coords?.latitude ?? ""),
              lng: String(position?.coords?.longitude ?? ""),
            });
          },
          () => resolve(null),
          { enableHighAccuracy: false, timeout: 4000, maximumAge: 120000 }
        );
      } catch (error) {
        resolve(null);
      }
    });

  const buildAttendanceForm = async (timeKey, timeValue, image) => {
    const formData = new FormData();
    formData.append(timeKey, timeValue);
    formData.append("images", image);
    const coords = await getCoordinates();
    if (coords?.lat && coords?.lng) {
      const latKey = timeKey === "clock_in_time" ? "clock_in_lat" : "clock_out_lat";
      const lngKey = timeKey === "clock_in_time" ? "clock_in_lng" : "clock_out_lng";
      formData.append(latKey, coords.lat);
      formData.append(lngKey, coords.lng);
    }
    return formData;
  };

  const hasAssignedTaskToday = async () => {
    const response = await apiGet(base.todayBooking);
    const payload = response.data?.data;
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.rows)
      ? payload.rows
      : [];
    const count = Number(payload?.count);
    return (Number.isFinite(count) ? count : rows.length) > 0 || rows.length > 0;
  };

  const showAttendanceError = (message, title = "Attendance") => {
    const text = message || "Something went wrong. Please try again.";
    Toast.show({ type: "error", text1: text });
    Alert.alert(title, text);
  };

  const imagePickerOptions = {
    mediaType: "photo",
    quality: 0.8,
    selectionLimit: 1,
  };

  const cameraOptions = {
    mediaType: "photo",
    quality: 0.8,
    saveToPhotos: false,
    cameraType: "back",
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs permission to access your camera.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  };

  const requestPhotoLibraryPermission = async () => {
    if (Platform.OS === "ios") {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    }
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleImagePickerError = (response, onGalleryFallback, action = "capture image") => {
    if (response.didCancel) {
      return true;
    }
    if (response.errorCode) {
      if (response.errorCode === "camera_unavailable" && onGalleryFallback) {
        Alert.alert(
          "Camera unavailable",
          "Camera is not available on this device. Please upload from gallery.",
          [
            { text: "Gallery", onPress: onGalleryFallback },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return true;
      }
      Toast.show({
        type: "error",
        text1: response.errorMessage || `Failed to ${action}`,
      });
      return true;
    }
    return false;
  };

  const pickImageForAttendance = async (onImageSelected) => {
    if (Platform.OS === "android") {
      const hasPermission = await requestPhotoLibraryPermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Photo library access is required to upload an image.");
        return;
      }
    }

    launchImageLibrary(imagePickerOptions, (response) => {
      if (handleImagePickerError(response, null, "pick image")) {
        return;
      }
      if (response.assets?.[0]) {
        onImageSelected(response.assets[0]);
      }
    });
  };

  const captureImageForAttendance = async (onImageSelected) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera access is required to take a photo.");
      return;
    }

    launchCamera(cameraOptions, (response) => {
      const galleryFallback = () => pickImageForAttendance(onImageSelected);
      if (handleImagePickerError(response, galleryFallback, "capture image")) {
        return;
      }
      if (response.assets?.[0]) {
        onImageSelected(response.assets[0]);
      }
    });
  };

  const openAttendanceImagePicker = async (type) => {
    if (loading) {
      return;
    }
    const isClockIn = type === "in";
    if (isClockIn) {
      try {
        const canClockIn = await hasAssignedTaskToday();
        if (!canClockIn) {
          showAttendanceError(
            "You do not have any assigned task for today.",
            "Clock In"
          );
          return;
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          return;
        }
      }
    }
    const onImageSelected = isClockIn ? fetchClockInStatus : fetchClockOutStatus;

    Alert.alert(
      isClockIn ? "Clock In" : "Clock Out",
      `Take a photo or upload from gallery to ${isClockIn ? "clock in" : "clock out"}.`,
      [
        { text: "Camera", onPress: () => captureImageForAttendance(onImageSelected) },
        { text: "Gallery", onPress: () => pickImageForAttendance(onImageSelected) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  const fetchClockInStatus = async (selectedImage) => {
    const image = normalizeAttendanceImage(selectedImage);
    if (!image) {
      Toast.show({ type: "error", text1: "Please upload an image to clock in" });
      return;
    }
    if (clockInInFlight.current) {
      return;
    }

    clockInInFlight.current = true;
    setLoading(true);
    try {
      const clockInTime = getCurrentDateTime();
      if (!clockInTime) {
        showAttendanceError("Clock in time is required", "Clock In");
        return;
      }

      const formData = await buildAttendanceForm(
        "clock_in_time",
        clockInTime,
        image
      );

      const response = await postFormData(base.clockIn, formData, {}, {
        timeout: UPLOAD_TIMEOUT_MS,
      });

      if (isApiSuccess(response?.status) && response.data?.success !== false) {
        await handleClockIn(clockInTime);
        refreshAttendanceHistory();
        Toast.show({ type: "success", text1: "Clocked in successfully" });
      } else {
        showAttendanceError(
          response.data?.message || "Clock in failed",
          "Clock In"
        );
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return;
      }
      showAttendanceError(
        error.response?.data?.message ||
          error.message ||
          "Clock in failed",
        "Clock In"
      );
    } finally {
      clockInInFlight.current = false;
      setLoading(false);
    }
  };

  const fetchClockOutStatus = async (selectedImage) => {
    const image = normalizeAttendanceImage(selectedImage);
    if (!image) {
      Toast.show({ type: "error", text1: "Please upload an image to clock out" });
      return;
    }
    if (clockOutInFlight.current) {
      return;
    }

    clockOutInFlight.current = true;
    setLoading(true);
    try {
      const clockOutTime = getCurrentDateTime();
      if (!clockOutTime) {
        showAttendanceError("Clock out time is required", "Clock Out");
        return;
      }

      const formData = await buildAttendanceForm(
        "clock_out_time",
        clockOutTime,
        image
      );

      const response = await postFormData(base.clockOut, formData, {}, {
        timeout: UPLOAD_TIMEOUT_MS,
      });
      if (isApiSuccess(response?.status) && response.data?.success !== false) {
        await handleClockOut();
        refreshAttendanceHistory();
        Toast.show({ type: "success", text1: "Clocked out successfully" });
      } else {
        showAttendanceError(
          response.data?.message || "Clock out failed",
          "Clock Out"
        );
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await handleClockOut();
        return;
      }
      showAttendanceError(
        error.response?.data?.message ||
          error.message ||
          "Clock out failed",
        "Clock Out"
      );
    } finally {
      clockOutInFlight.current = false;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={{}}>
        <View style={styles.HomeContainer}>

          <View style={styles.HeaderContainer}>
            <Text style={[styles.topHeadingTxt, { marginTop: "8%" }]}>
              My Attendance
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                marginTop: "5%",
                paddingLeft: 5,
              }}
            >
              <Image
                source={images.calendarColor}
                style={{ height: 15, width: 15 }}
              />

              <Text
                style={[
                  styles.topHeadingTxt,
                  { fontSize: 13, fontWeight: "400" },
                ]}
              >

                {moment(date).format('DD MMM YYYY')}
              </Text>
            </View>
            {clockedIn ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.topHeadingTxt,
                    { fontSize: 20, fontWeight: "500", marginTop: "2%" },
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
                      marginTop: "2%",
                      marginRight: "5%",
                    },
                  ]}
                >
              {formatTime(elapsedTime)} hr
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.topHeadingTxt,
                  { fontSize: 20, fontWeight: "500", },
                ]}
              >
                Let's get to work!
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            {clockedIn ? (
              <TouchableOpacity
                style={[styles.leave, { flex: 1, marginRight: 10, opacity: loading ? 0.7 : 1 }]}
                disabled={loading}
                onPress={() => openAttendanceImagePicker("out")}
              >
                <Text style={styles.buttonText}>{loading ? "CLOCKING OUT..." : "CLOCK OUT"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 10, opacity: loading ? 0.7 : 1 }]}
                activeOpacity={0.8}
                disabled={loading}
                onPress={() => openAttendanceImagePicker("in")}
              >
                <LinearGradient
                  colors={["rgba(36, 51, 82, 1)", "rgb(68, 200, 83)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.linearGradient}
                >
                  <Text style={styles.buttonText}>{loading ? "CLOCKING IN..." : "CLOCK IN"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Leaves")}
            >
              <LinearGradient
                colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
              >
                <View style={styles.chidLeaveBtn}>
                  <Text style={styles.buttonText1}>LEAVES</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.historyTxt}>Attendance history</Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={selectedDate}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={selectedTime}
              themeVariant="light"
              textColor="#000000"
            />
            <View style={[styles.fieldCont, { right: 10 }]}>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={() => {
                  showDatePicker();
                }}
              >

                <Text style={styles.titleTxt}>{moment(selectedDate).format("YYYY-MM-DD")}</Text>
                <Image source={images.calendar} style={{ height: 16, width: 16, tintColor: '#000' ,marginLeft:3}} />
              </TouchableOpacity>

            </View>

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="date"
              date={selectedTime}
              onConfirm={HandleTimeConfirm}
              onCancel={HideTimePicker}
              minimumDate={selectedDate}
              maximumDate={new Date()}
              themeVariant="light"
              textColor="#000000"
            />
            <View style={[styles.fieldCont, { right: 20 }]}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={() => {
                  showTimePicker();
                }}
              >

                <Text style={styles.titleTxt}>{moment(selectedTime).format("YYYY-MM-DD")}</Text>

                <Image source={images.calendar} style={{ height: 16, width: 16, tintColor: '#000',marginLeft:3 }} />
              </TouchableOpacity>

            </View>
          </View>

          {historyLoading ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>Loading...</Text>
            </View>
          ) : attendanceData.length > 0 ? (
            attendanceData.map((item) => (
              <View key={item.id?.toString() || `${item.clock_in}-${item.clock_out}`} style={styles.TaskCont}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: "3%",
                  }}
                >
                  <View
                    style={{
                      flex: 2,
                      backgroundColor: "#ffff",
                      height: "100%",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={images.calendarColor}
                        style={{ marginTop: "2%", height: 12, width: 12 }}
                      />
                      <Text style={{ color: "#000", marginLeft: 6 }}>
                        {moment(getAttendanceDate(item)).isValid()
                          ? `${moment(getAttendanceDate(item)).format("DD MMM")}  |  ${moment(getAttendanceDate(item)).format("hh:mm A")}`
                          : "Invalid date"}
                      </Text>
                    </View>
                    <Text style={styles.taskContainerTimming}>
                      {item.total_hours || "0 hours"}
                    </Text>
                  </View>
                  <View
                    style={{ flex: 2, backgroundColor: "#fff", height: "100%" }}
                  >
                    <Text style={{ color: "#000" }}>In & Out </Text>
                    <Text style={styles.taskContainerTimming}>
                      {formatClockRange(
                        item.clock_in_est || item.clock_in,
                        item.clock_out_est || item.clock_out
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>No History Found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  topHeadingTxt: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    paddingLeft: 5,
    marginBottom: 5,
  },
  MainContainer: { backgroundColor: "#fff", flex: 1 },
  HeaderContainer: {
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
  linearGradient: {
    borderRadius: 30,
    height: 45,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: "500", color: "#fff", fontSize: width / 25 },
  buttonText1: {
    fontWeight: "500",
    color: "#000",
    fontSize: width / 25,
    alignItems: "center",
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
    paddingLeft: 10,
    marginBottom: 5,
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
    paddingLeft: "5%",
    marginTop: "4%",
    fontWeight: "bold",
  },
  taskContainerTimming: {
    color: "#212121",
    fontWeight: "700",
    fontSize: 14,
    marginTop: "5%",
  },
  chidLeaveBtn: {
    height: "97%",
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,

  },
  leave: {
    borderRadius: 30,
    height: 45,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DF5A5A",
  },
  titleTxt: {
    color: "#000fff80",
    fontWeight: "700",
    fontSize: 12
  },
  fieldCont: {
    marginTop: "5%",
    justifyContent: "center",
    flexDirection: 'row'
  },
  emptyHistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  emptyHistoryText: {
    fontSize: 18,
    color: "#000",
  },
});
