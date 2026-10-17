import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Platform, Text } from "react-native";

import Profile from "../screen/Profile/Profile";
import images from "../assets/images";
import Login from "../screen/Auth/Login";
import Splash from "../screen/splash/Splash";
import MyAppointments from "../screen/MyBookings/index";
import Home from "../screen/HomeScreen/Home";
import Attendance from "../screen/Attendance/Attendance";
import AttendanceLeave from "../screen/Attendance/AttendanceLeave";
import Chat from "../screen/ChatScreen/Chat";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {(props) => <MyTabs {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={<Login />}
      />
      <Stack.Screen
        name="Splash"
        options={{ headerShown: false }}
        component={<Splash />}
      />
    </Stack.Navigator>
  );
};

const TabLabel = ({ label, focused }) => (
  <Text
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.8}
    allowFontScaling={false}
    style={{
      fontSize: 11,
      lineHeight: 14,
      fontWeight: focused ? "600" : "500",
      color: "#243352",
      textAlign: "center",
      width: "100%",
    }}
  >
    {label}
  </Text>
);

const tabIconStyle = { height: 24, width: 24, resizeMode: "contain" };

export function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#243352",
        tabBarInactiveTintColor: "#243352",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          height: Platform.OS === "ios" ? 82 : 62,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 22 : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="My Work" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={tabIconStyle}
              source={!focused ? images.myWorkFade : images.myWork}
            />
          ),
        }}
        name="My Work"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="My Attendance" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={tabIconStyle}
              source={!focused ? images.myattendanceFade : images.myattendance}
            />
          ),
        }}
        name="My Attendance"
        component={Attendance}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Chat" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={tabIconStyle}
              source={!focused ? images.chatFade : images.Chat}
            />
          ),
        }}
        name="Chat"
        component={Chat}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Profile" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={tabIconStyle}
              source={!focused ? images.UserFade : images.ProfileGradient}
            />
          ),
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}
