import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CalendarDays, ChevronRight } from '../../components/icons';
import { AppText, Card, StatusPill } from '../../components';
import { jobStatusDisplay } from '../../constants/statuses';
import { colors, radius, space } from '../../theme';
import { bookingAttachments, photoUri } from './jobPhotos';
import { jobWhen } from './JobSummary';

export default function JobCard({ job, onPress }) {
  const status = jobStatusDisplay(job?.booking_status);
  const title = job?.service_booking?.name || job?.booking_name || 'Job';
  const when = jobWhen(job);
  const imageUri = photoUri(bookingAttachments(job)[0]);

  return (
    <Card
      padded={false}
      onPress={onPress}
      accessibilityLabel={`${title}, ${status.label}${when ? `, ${when}` : ''}`}
      style={styles.card}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}
      <View style={styles.body}>
        <View style={styles.text}>
          <StatusPill label={status.label} tone={status.tone} />
          <AppText variant="subtitle" numberOfLines={2}>
            {title}
          </AppText>
          {when ? (
            <View style={styles.inline}>
              <CalendarDays size={15} color={colors.mutedForeground} />
              <AppText variant="small">{when}</AppText>
            </View>
          ) : null}
        </View>
        <ChevronRight size={20} color={colors.mutedForeground} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.muted,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
  },
  text: { flex: 1, gap: space.xs },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
