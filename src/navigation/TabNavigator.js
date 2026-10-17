import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BriefcaseBusiness,
  CalendarCheck,
  MessagesSquare,
  UserRound,
} from '../components/icons';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import MyWorkScreen from '../screens/jobs/MyWorkScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors, fonts, radius } from '../theme';

const Tab = createBottomTabNavigator();

// The active tab's icon sits on a green block, like the selected segment elsewhere.
const tabIcon =
  Icon =>
  ({ focused }) =>
    (
      <View style={[styles.icon, focused && styles.iconActive]}>
        <Icon
          size={20}
          color={focused ? colors.primaryForeground : colors.mutedForeground}
          strokeWidth={focused ? 2.25 : 2}
        />
      </View>
    );

// React Navigation fixes the bar at 49 points plus the bottom inset, too short for the icon
// block and label, which then slid into the gesture area. The bar is sized to its content:
// border 1, padding 6 + 2 + 6, icon block 28, gap 2, and the label line at the phone's text size.
const BAR_FIXED = 45;
const LABEL_LINE = 14;

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const barHeight =
    Math.ceil(BAR_FIXED + LABEL_LINE * fontScale) + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: [styles.bar, { height: barHeight }],
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tab.Screen
        name="My Work"
        component={MyWorkScreen}
        options={{ tabBarIcon: tabIcon(BriefcaseBusiness) }}
      />
      <Tab.Screen
        name="My Attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: tabIcon(CalendarCheck),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{ tabBarIcon: tabIcon(MessagesSquare) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon(UserRound) }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 6,
  },
  item: { paddingTop: 2, paddingBottom: 6 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: LABEL_LINE,
    marginTop: 2,
  },
  icon: {
    width: 48,
    height: 28,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: { backgroundColor: colors.primary },
});
