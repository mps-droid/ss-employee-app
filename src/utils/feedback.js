import Toast from 'react-native-toast-message';

/**
 * One way to tell staff what happened, on both platforms (ToastAndroid shows
 * nothing on iOS). Messages are plain sentences.
 */
export const notify = {
  success: (text1, text2) => Toast.show({ type: 'success', text1, text2 }),
  error: (text1, text2) => Toast.show({ type: 'error', text1, text2 }),
  info: (text1, text2) => Toast.show({ type: 'info', text1, text2 }),
};

// The server's message when it sent one, otherwise our fallback.
export const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Development-only diagnostics. Release builds log nothing, so no personal data
// reaches the device log.
export const logError = (context, error) => {
  if (__DEV__) {
    console.warn(`[${context}]`, error?.message || error);
  }
};
