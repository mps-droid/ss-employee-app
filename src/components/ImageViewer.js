import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from './icons';
import { colors, space } from '../theme';
import IconButton from './IconButton';

// Full-screen photo on the site's dark overlay. Closes with the X or the back button.
export default function ImageViewer({ uri, onClose }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={!!uri}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        ) : null}
        <View style={[styles.close, { top: insets.top + space.xs }]}>
          <IconButton
            icon={X}
            label="Close photo"
            color={colors.white}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
  },
  image: { width: '100%', height: '80%' },
  close: { position: 'absolute', right: space.sm },
});
