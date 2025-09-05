import { ROLES } from './roles';

interface MenuConfig {
  dashboardName: string;
  dashboardHref: string;
  appointmentsName: string;
  appointmentsHref: string;
}

export const menuByRole: Record<string, MenuConfig> = {
  [ROLES.PATIENT]: {
    dashboardName: 'Dashboard',
    dashboardHref: '/dashboard',
    appointmentsName: 'Appointments',
    appointmentsHref: '/appointments'
  },
  [ROLES.DOCTOR]: {
    dashboardName: 'Doctor Dashboard',
    dashboardHref: '/doctor-dashboard',
    appointmentsName: 'Doctor Appointments',
    appointmentsHref: '/doctor-appointments'
  },
  [ROLES.ADMIN]: {
    dashboardName: 'Admin Dashboard',
    dashboardHref: '/admin-dashboard',
    appointmentsName: 'Admin Appointments',
    appointmentsHref: '/admin-appointments'
  }
};