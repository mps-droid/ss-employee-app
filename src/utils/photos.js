import { Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  ensureCameraPermission,
  ensurePhotoLibraryPermission,
} from './permissions';

// Photos are resized before upload so they finish quickly on mobile data.
const PHOTO_OPTIONS = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1600,
  maxHeight: 1600,
};

const pickerError = result => {
  if (result.didCancel) {
    return null;
  }
  if (result.errorCode) {
    const error = new Error(
      result.errorCode === 'camera_unavailable'
        ? 'This device has no camera available.'
        : result.errorMessage || 'Could not open the camera or photos.',
    );
    error.code = result.errorCode;
    return error;
  }
  return null;
};

// Resolves to an array of picker assets; empty when the person cancels.
export const takePhoto = async () => {
  if (!(await ensureCameraPermission())) {
    return [];
  }
  const result = await launchCamera({
    ...PHOTO_OPTIONS,
    saveToPhotos: false,
    cameraType: 'back',
  });
  const error = pickerError(result);
  if (error) {
    throw error;
  }
  return result.assets || [];
};

export const choosePhotos = async ({ limit = 1 } = {}) => {
  if (!(await ensurePhotoLibraryPermission())) {
    return [];
  }
  const result = await launchImageLibrary({
    ...PHOTO_OPTIONS,
    selectionLimit: limit,
  });
  const error = pickerError(result);
  if (error) {
    throw error;
  }
  return result.assets || [];
};

// Shapes a picker asset as the { uri, name, type } file object FormData expects.
export const toUploadFile = (asset, fallbackName = 'photo') => {
  if (!asset?.uri) {
    return null;
  }
  let uri = String(asset.uri);
  if (Platform.OS === 'ios' && uri.startsWith('/')) {
    uri = `file://${uri}`;
  }
  const rawName =
    asset.fileName ||
    uri.split('/').pop()?.split('?')[0] ||
    `${fallbackName}_${Date.now()}.jpg`;
  const safeName = rawName.replace(/\.(heic|heif)$/i, '.jpg');
  const name = /\.(jpe?g|png|webp)$/i.test(safeName)
    ? safeName
    : `${safeName}.jpg`;
  const type = /^image\/(jpe?g|png|webp)$/i.test(asset.type || '')
    ? asset.type.replace('image/jpg', 'image/jpeg')
    : 'image/jpeg';
  return { uri, name, type };
};
