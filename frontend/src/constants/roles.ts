export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];