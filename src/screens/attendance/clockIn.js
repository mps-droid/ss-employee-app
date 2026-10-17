import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { dayjs, parseDate } from '../../utils/date';

/**
 * Clock-in times can arrive as epoch milliseconds, ISO strings or the API's own
 * formats, and some servers mark local times as UTC. Every reading is tried and the
 * latest one that is not in the future wins.
 */
export const parseClockInMs = value => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const now = Date.now();
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 1e12 && numeric <= now + 60000) {
    return numeric;
  }
  const raw = String(value).trim();
  const candidates = [];
  const parsed = parseDate(raw);
  if (parsed) {
    candidates.push(parsed.valueOf());
  }
  const local = raw.replace(/Z$/i, '').replace(/[+-]\d{2}:\d{2}$/, '');
  if (local !== raw) {
    const localParsed = dayjs(local);
    if (localParsed.isValid()) {
      candidates.push(localParsed.valueOf());
    }
  }
  const past = candidates.filter(ms => Number.isFinite(ms) && ms <= now + 2000);
  return past.length ? Math.max(...past) : null;
};

export const saveClockIn = epochMs =>
  AsyncStorage.setMany({
    clockInEpoch: String(epochMs),
    clockInTime: new Date(epochMs).toISOString(),
  });

export const readSavedClockIn = async () => {
  const saved = await AsyncStorage.getMany(['clockInEpoch', 'clockInTime']);
  return (
    parseClockInMs(saved.clockInEpoch) || parseClockInMs(saved.clockInTime)
  );
};

export const clearSavedClockIn = () =>
  AsyncStorage.removeMany(['clockInEpoch', 'clockInTime']);

// Best effort: resolves to null when location is off or slow, and clocking still works.
export const getCoordinates = () =>
  new Promise(resolve => {
    try {
      Geolocation.getCurrentPosition(
        position =>
          resolve({
            lat: String(position?.coords?.latitude ?? ''),
            lng: String(position?.coords?.longitude ?? ''),
          }),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 120000 },
      );
    } catch {
      resolve(null);
    }
  });
