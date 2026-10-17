import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export { dayjs };

// Formats the API sends besides ISO 8601.
const API_FORMATS = [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DD',
];

// Parses ISO strings, the API's formats, epoch milliseconds and Date objects.
export const parseDate = value => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value instanceof Date || typeof value === 'number') {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }
  const iso = dayjs(value);
  if (iso.isValid()) {
    return iso;
  }
  const custom = dayjs(String(value), API_FORMATS, true);
  return custom.isValid() ? custom : null;
};

export const formatDate = (value, format = 'DD MMM YYYY', fallback = '') => {
  const d = parseDate(value);
  return d ? d.format(format) : fallback;
};

export const formatTime = (value, fallback = '') =>
  formatDate(value, 'h:mm A', fallback);

// "14:30" or "14:30:00" -> "2:30 PM"
export const formatClockTime = time24 => {
  if (!time24 || typeof time24 !== 'string') {
    return '';
  }
  const [hoursText, minutes] = time24.split(':');
  const hours = parseInt(hoursText, 10);
  if (Number.isNaN(hours) || minutes === undefined) {
    return time24;
  }
  return `${hours % 12 || 12}:${minutes.slice(0, 2)} ${
    hours >= 12 ? 'PM' : 'AM'
  }`;
};

// Date the API expects in request bodies.
export const toApiDate = value => dayjs(value).format('YYYY-MM-DD');

export const nowApiDateTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss');

// The API sends worked time as text: "1 hours 1 minutes" -> "1 h 1 min".
// Anything in another shape is shown as sent.
export const formatWorkedTime = text => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  const hours = text.match(/(\d+)\s*hours?\b/i);
  const minutes = text.match(/(\d+)\s*minutes?\b/i);
  if (!hours && !minutes) {
    return text;
  }
  const h = hours ? Number(hours[1]) : 0;
  const m = minutes ? Number(minutes[1]) : 0;
  if (!h) {
    return `${m} min`;
  }
  return m ? `${h} h ${m} min` : `${h} h`;
};

// 3725 -> "01:02:05"
export const formatDuration = totalSeconds => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const pad = n => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(
    Math.floor((s % 3600) / 60),
  )}:${pad(s % 60)}`;
};
