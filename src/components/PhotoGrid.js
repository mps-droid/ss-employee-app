import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { X } from './icons';
import { colors, radius, space } from '../theme';
import ImageViewer from './ImageViewer';

/**
 * Three-column grid of photos. Tapping a photo opens it full screen; with `onRemove`
 * each photo also gets a remove button.
 */
export default function PhotoGrid({ uris = [], onRemove, style }) {
  const [viewing, setViewing] = useState(null);
  if (!uris.length) {
    return null;
  }
  return (
    <View style={[styles.grid, style]}>
      {uris.map((uri, index) => (
        <View key={`${uri}-${index}`} style={styles.cell}>
          <Pressable
            accessibilityRole="imagebutton"
            accessibilityLabel={`Open photo ${index + 1}`}
            onPress={() => setViewing(uri)}
            style={styles.tile}
          >
            <Image source={{ uri }} style={styles.image} />
          </Pressable>
          {onRemove ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove photo ${index + 1}`}
              onPress={() => onRemove(index)}
              hitSlop={8}
              style={styles.remove}
            >
              <X size={14} color={colors.white} strokeWidth={3} />
            </Pressable>
          ) : null}
        </View>
      ))}
      <ImageViewer uri={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  cell: { width: '33.333%', padding: 4 },
  tile: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.foreground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    margin: space.xxs / 2,
  },
});
