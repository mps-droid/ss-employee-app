import { getDatabase } from '@react-native-firebase/database';

// The default Firebase app is configured natively from google-services.json (Android)
// and GoogleService-Info.plist (iOS), which also carry the Realtime Database URL.
export const chatDatabase = () => getDatabase();
