import { IMAGE_BASE_URL } from '../../api/endpoints';

export const photoUri = attachment => {
  const fileName = attachment?.file_name || attachment?.fileName;
  if (!fileName) {
    return null;
  }
  return String(fileName).startsWith('http')
    ? fileName
    : `${IMAGE_BASE_URL}${fileName}`;
};

// Photos are stored on the booking, sometimes on its service.
export const bookingAttachments = job => {
  const lists = [
    job?.booking_attachment,
    job?.service_attachments,
    job?.service_booking?.service_attachments,
  ];
  return lists.find(list => Array.isArray(list) && list.length) || [];
};

// Before, after and untitled photos. Photos added in the app carry no title, so
// they show under "Job photos" instead of disappearing.
export const groupJobPhotos = job => {
  const groups = { before: [], after: [], other: [] };
  bookingAttachments(job).forEach(attachment => {
    const uri = photoUri(attachment);
    if (!uri) {
      return;
    }
    const title = String(attachment?.title || '').toUpperCase();
    if (title === 'BEFORE SERVICE') {
      groups.before.push(uri);
    } else if (title === 'AFTER SERVICE') {
      groups.after.push(uri);
    } else {
      groups.other.push(uri);
    }
  });
  return groups;
};
