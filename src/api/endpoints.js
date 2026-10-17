import { API_BASE_URL } from '../config/env';

const url = path => `${API_BASE_URL}${path}`;

// Uploaded files (job and chat photos) are served from here by file name.
export const IMAGE_BASE_URL = url('/images/');

export const endpoints = {
  // Authentication
  login: url('/user/auth/login'),
  logout: url('/user/auth/logout'),
  sendOtp: url('/user/auth/otp'),
  verifyOtp: url('/user/auth/verify-otp'),
  forgotPassword: url('/user/auth/forgot-password'),
  changePassword: url('/user/auth/reset-password'),

  // Profile
  profile: url('/user/profile'),
  updateProfile: url('/user/updateUserProfile'),
  deactivateAccount: url('/user/deactivate'),

  // Jobs
  employeeBookings: url('/booking/getAllEmployeeBooking'),
  todaysBookings: url('/booking/getTodaysBooking'),
  completedBookings: url('/booking/getCompletedBooking'),
  bookingById: url('/booking/getBookingById'),
  updateBookingStatus: url('/booking/updateBookingStatusByEmployee'),
  uploadJobImages: url('/booking/uploadImages'),
  checklist: url('/booking/getAllServiceCheckList'),
  completeChecklistItem: url('/booking/markChecklistItemAsCompleted'),

  // Attendance and leave
  attendance: url('/attendance/getAttendance'),
  clockInStatus: url('/attendance/checkClockInStatus'),
  clockIn: url('/attendance/clockIn'),
  clockOut: url('/attendance/clockOut'),
  leaves: url('/attendance/getAllUserLeaves'),
  applyLeave: url('/attendance/applyForLeave'),

  // Chat and notifications
  chatGroups: url('/firebase/myGroups'),
  notifications: url('/firebase/getAllNotificationsOfUser'),
  markNotificationRead: url('/firebase/markOneNotificationAsRead'),
  markAllNotificationsRead: url('/firebase/markAllNotificationAsRead'),
};

// Requests to these paths never carry the session token.
export const PUBLIC_PATHS = [
  '/user/auth/login',
  '/user/auth/otp',
  '/user/auth/verify-otp',
  '/user/auth/forgot-password',
];
