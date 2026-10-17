import { AppState } from "react-native";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MyTabs } from "./src/navigation/Routes";
import {
  setNavigationRef,
  getAuthHeaders,
} from "./src/ApiServices/ApiService";
import Login from "./src/screen/Auth/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import Splash from "./src/screen/splash/Splash";
import EditProfile from "./src/screen/Profile/EditProfile";
import JobDetails from "./src/screen/JobDetails/JobDetails";
import JobDone from "./src/screen/JobDetails/JobDone";
import CheckList from "./src/screen/JobDetails/CheckList";
import Notification from "./src/screen/Notification/Notification";
import CompleteJob from "./src/screen/JobDetails/CompleteJob";
import ChangePassword from "./src/screen/Profile/ChangePassword";

import Leaves from "./src/screen/Attendance/Leaves";
import ApplyLeave from "./src/screen/Attendance/ApplyLeave";
import AddImages from "./src/screen/JobDetails/AddImages";

import ForgotPassword from "./src/screen/Auth/ForgotPassword";
import ChatDetail from "./src/screen/ChatScreen/ChatDetails";
import About from "./src/screen/Profile/About";

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef(null);

  useEffect(() => {
    setNavigationRef(navigationRef);

    const defaultHandler =
      global.ErrorUtils && typeof global.ErrorUtils.getGlobalHandler === "function"
        ? global.ErrorUtils.getGlobalHandler()
        : null;
    if (global.ErrorUtils && typeof global.ErrorUtils.setGlobalHandler === "function") {
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error(error?.message, error?.stack);
        Toast.show({
          type: "error",
          text1: error?.message || "Something went wrong",
        });
        if (typeof defaultHandler === "function") {
          defaultHandler(error, isFatal);
        }
      });
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        getAuthHeaders().catch(() => {});
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setNavigationRef(navigationRef)}
    >
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {(props) => <MyTabs {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <Login />}
        </Stack.Screen>
        <Stack.Screen name="Welcome" options={{ headerShown: false }}>
          {(props) => <Splash />}
        </Stack.Screen>
        <Stack.Screen name="EditProfile" options={{ headerShown: false }}>
          {(props) => <EditProfile />}
        </Stack.Screen>
        <Stack.Screen name="JobDetails" options={{ headerShown: false }}>
          {(props) => <JobDetails />}
        </Stack.Screen>
        <Stack.Screen name="JobDone" options={{ headerShown: false }}>
          {(props) => <JobDone />}
        </Stack.Screen>
        <Stack.Screen name="CheckList" options={{ headerShown: false }}>
          {(props) => <CheckList />}
        </Stack.Screen>
        <Stack.Screen name="ChatDetail" options={{ headerShown: false }}>
          {(props) => <ChatDetail />}
        </Stack.Screen>
        <Stack.Screen name="Notification" options={{ headerShown: false }}>
          {(props) => <Notification />}
        </Stack.Screen>
        <Stack.Screen name="CompleteJob" options={{ headerShown: false }}>
          {(props) => <CompleteJob />}
        </Stack.Screen>
        <Stack.Screen name="ChangePassword" options={{ headerShown: false }}>
          {(props) => <ChangePassword />}
        </Stack.Screen>
        <Stack.Screen name="Leaves" options={{ headerShown: false }}>
          {(props) => <Leaves />}
        </Stack.Screen>
        <Stack.Screen name="ApplyLeave" options={{ headerShown: false }}>
          {(props) => <ApplyLeave />}
        </Stack.Screen>
        <Stack.Screen name="AddImages" options={{ headerShown: false }}>
          {(props) => <AddImages />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen
          name="About"
          options={{ headerShown: false }}
        >
          {(props) => <About />}
        </Stack.Screen>
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
