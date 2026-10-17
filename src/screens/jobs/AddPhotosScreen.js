import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, Images, Upload } from '../../components/icons';
import { apiUpload } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import {
  AppText,
  Button,
  Eyebrow,
  Header,
  PhotoGrid,
  Screen,
} from '../../components';
import { space } from '../../theme';
import { errorMessage, notify } from '../../utils/feedback';
import { choosePhotos, takePhoto, toUploadFile } from '../../utils/photos';

// The supervisor adds photos of the finished work to the job.
export default function AddPhotosScreen({ navigation, route }) {
  const jobId = route.params?.jobId;
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const add = async pick => {
    try {
      const assets = await pick();
      if (assets.length) {
        setPhotos(current => [...current, ...assets]);
      }
    } catch (e) {
      notify.error(errorMessage(e, 'Could not add that photo.'));
    }
  };

  const upload = async () => {
    if (!photos.length || uploading) {
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', String(jobId));
      photos.forEach((asset, index) => {
        const file = toUploadFile(asset, `job_${jobId}_${index + 1}`);
        if (file) {
          formData.append('images', file);
        }
      });
      await apiUpload(endpoints.uploadJobImages, formData);
      notify.success(
        photos.length === 1
          ? 'Photo uploaded'
          : `${photos.length} photos uploaded`,
      );
      navigation.goBack();
    } catch (e) {
      notify.error(
        errorMessage(e, 'Upload failed. Check your connection and try again.'),
      );
    } finally {
      setUploading(false);
    }
  };

  const count = photos.length;

  return (
    <Screen
      scroll
      header={<Header title="Add photos" />}
      footer={
        <Button
          title={
            count
              ? `Upload ${count} ${count === 1 ? 'photo' : 'photos'}`
              : 'Upload photos'
          }
          icon={Upload}
          onPress={upload}
          loading={uploading}
          disabled={!count}
        />
      }
    >
      <View style={styles.stack}>
        <View style={styles.intro}>
          <Eyebrow>After the job</Eyebrow>
          <AppText variant="title">Show the finished work</AppText>
          <AppText variant="body">
            Photos are saved to the job, so your team and the client can see the
            result.
          </AppText>
        </View>
        <View style={styles.actions}>
          <Button
            title="Take photo"
            icon={Camera}
            variant="outline"
            onPress={() => add(takePhoto)}
            disabled={uploading}
            style={styles.action}
          />
          <Button
            title="From library"
            icon={Images}
            variant="outline"
            onPress={() => add(() => choosePhotos({ limit: 0 }))}
            disabled={uploading}
            style={styles.action}
          />
        </View>
        <PhotoGrid
          uris={photos.map(asset => asset.uri)}
          onRemove={
            uploading
              ? undefined
              : index =>
                  setPhotos(current => current.filter((_, i) => i !== index))
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.xl },
  intro: { gap: space.xs },
  actions: { flexDirection: 'row', gap: space.sm },
  action: { flex: 1 },
});
