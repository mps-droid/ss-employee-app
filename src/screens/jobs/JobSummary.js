import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { CalendarDays, MapPin, UserRound } from '../../components/icons';
import {
  AppText,
  Button,
  Card,
  PhotoGrid,
  Section,
  StatusPill,
} from '../../components';
import { jobStatusDisplay } from '../../constants/statuses';
import { colors, radius, space } from '../../theme';
import { formatClockTime, formatDate } from '../../utils/date';
import { notify } from '../../utils/feedback';
import { groupJobPhotos } from './jobPhotos';

export const jobAddress = job =>
  [
    job?.booking_address?.address,
    job?.booking_address?.user_city?.name,
    job?.booking_address?.user_state?.name,
    job?.booking_address?.user_country?.name,
  ]
    .filter(Boolean)
    .join(', ');

export const jobWhen = job =>
  [formatDate(job?.date, 'ddd D MMM'), formatClockTime(job?.time)]
    .filter(Boolean)
    .join(' · ');

// Opens the address in the phone's maps app (Google Maps, or the browser).
const openInMaps = async address => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
  try {
    await Linking.openURL(url);
  } catch {
    notify.error('Could not open maps on this phone.');
  }
};

/**
 * Everything staff need to know about a job, shared by the job details and
 * job-in-progress screens.
 */
export default function JobSummary({ job }) {
  const status = jobStatusDisplay(job?.booking_status);
  const address = jobAddress(job);
  const when = jobWhen(job);
  const photos = groupJobPhotos(job);
  const executive = job?.bdm_details?.name;

  return (
    <View style={styles.stack}>
      <Card style={styles.headline}>
        <StatusPill label={status.label} tone={status.tone} />
        <AppText variant="title">
          {job?.service_booking?.name || job?.booking_name || 'Job'}
        </AppText>
        {when ? (
          <View style={styles.inline}>
            <CalendarDays size={16} color={colors.mutedForeground} />
            <AppText variant="small">{when}</AppText>
          </View>
        ) : null}
      </Card>

      <Section label="Notes">
        <AppText variant="body">
          {job?.notes?.trim() || 'There are no notes for this job.'}
        </AppText>
      </Section>

      <Section label="Service location">
        <View style={styles.inline}>
          <MapPin size={18} color={colors.mutedForeground} />
          <AppText variant="body" style={styles.flex}>
            {address || 'No address on file.'}
          </AppText>
        </View>
        {address ? (
          <Button
            title="Open in Maps"
            icon={MapPin}
            variant="outline"
            size="sm"
            fullWidth={false}
            onPress={() => openInMaps(address)}
          />
        ) : null}
      </Section>

      <Section label="Executive assigned">
        <View style={styles.person}>
          <View style={styles.avatar}>
            <UserRound size={20} color={colors.foreground} />
          </View>
          <AppText variant="bodyStrong">
            {executive || 'Not assigned yet'}
          </AppText>
        </View>
      </Section>

      {photos.before.length ? (
        <Section label="Before service">
          <PhotoGrid uris={photos.before} />
        </Section>
      ) : null}
      {photos.after.length ? (
        <Section label="After service">
          <PhotoGrid uris={photos.after} />
        </Section>
      ) : null}
      {photos.other.length ? (
        <Section label="Job photos">
          <PhotoGrid uris={photos.other} />
        </Section>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.xl },
  headline: { gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  flex: { flex: 1 },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.brandWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
