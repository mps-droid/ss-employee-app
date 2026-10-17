// Role IDs as the API defines them.
export const ROLES = {
  SUPERVISOR: '7',
  QUALITY_INSPECTOR: '8',
  CLEANER: '9',
};

export const ROLE_OPTIONS = [
  { id: ROLES.SUPERVISOR, label: 'Supervisor' },
  { id: ROLES.QUALITY_INSPECTOR, label: 'Quality Inspector' },
  { id: ROLES.CLEANER, label: 'Cleaner' },
];

export const roleLabel = id =>
  ROLE_OPTIONS.find(role => role.id === String(id))?.label || '';
