import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApplyLeaveScreen from '../screens/attendance/ApplyLeaveScreen';
import LeavesScreen from '../screens/attendance/LeavesScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import ChatThreadScreen from '../screens/chat/ChatThreadScreen';
import AddPhotosScreen from '../screens/jobs/AddPhotosScreen';
import ChecklistScreen from '../screens/jobs/ChecklistScreen';
import JobCompletedScreen from '../screens/jobs/JobCompletedScreen';
import JobDetailsScreen from '../screens/jobs/JobDetailsScreen';
import JobInProgressScreen from '../screens/jobs/JobInProgressScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { colors } from '../theme';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

// Route names are kept from the original app, since the API helpers and saved
// navigation refer to them.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={SplashScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="Notification" component={NotificationsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="JobDone" component={JobInProgressScreen} />
      <Stack.Screen name="CheckList" component={ChecklistScreen} />
      <Stack.Screen name="AddImages" component={AddPhotosScreen} />
      <Stack.Screen
        name="CompleteJob"
        component={JobCompletedScreen}
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      <Stack.Screen name="ChatDetail" component={ChatThreadScreen} />
      <Stack.Screen name="Leaves" component={LeavesScreen} />
      <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
