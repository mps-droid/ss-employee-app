import { Alert, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

const CAMERA = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});

const askForSettings = (title, message) =>
  Alert.alert(title, message, [
    { text: 'Not now', style: 'cancel' },
    { text: 'Open settings', onPress: () => openSettings() },
  ]);

const ensure = async (permission, title, message) => {
  let status = await check(permission);
  if (status === RESULTS.DENIED) {
    status = await request(permission);
  }
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return true;
  }
  if (status === RESULTS.BLOCKED) {
    askForSettings(title, message);
  }
  return false;
};

export const ensureCameraPermission = () =>
  ensure(
    CAMERA,
    'Camera access is off',
    'Turn on camera access in Settings to take photos for attendance and jobs.',
  );

// Android's photo picker needs no permission; iOS asks for library access.
export const ensurePhotoLibraryPermission = () =>
  Platform.OS === 'ios'
    ? ensure(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        'Photo access is off',
        'Turn on photo access in Settings to choose photos from your library.',
      )
    : Promise.resolve(true);
