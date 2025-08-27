import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profileImage?: string;
}

interface Patient {
  id: string;
  name: string;
  profileImage?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctor: Doctor;
  patient: Patient;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'in-person' | 'video';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
  bookAppointment: (appointmentData: Partial<Appointment>) => Promise<boolean>;
  cancelAppointment: (id: string) => Promise<boolean>;
  rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newEndTime: string) => Promise<boolean>;
}

/**
 * Custom hook to handle appointments
 * @returns Appointments state and methods
 */
export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockAppointments: Appointment[] = [
        {
          id: '101',
          doctorId: 'd1',
          patientId: 'p1',
          doctor: {
            id: 'd1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            profileImage: 'https://randomuser.me/api/portraits/women/76.jpg'
          },
          patient: {
            id: 'p1',
            name: 'John Doe',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          date: '2023-08-15',
          startTime: '10:00',
          endTime: '10:30',
          status: 'scheduled',
          type: 'video',
          notes: 'Follow-up appointment for heart condition.',
          symptoms: 'Occasional chest pain, shortness of breath'
        },
        {
          id: '102',
          doctorId: 'd2',
          patientId: 'p1',
          doctor: {
            id: 'd2',
            name: 'Dr. Michael Chen',
            specialty: 'Dermatologist',
            profileImage: 'https://randomuser.me/api/portraits/men/42.jpg'
          },
          patient: {
            id: 'p1',
            name: 'John Doe',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          date: '2023-07-20',
          startTime: '14:00',
          endTime: '14:30',
          status: 'completed',
          type: 'in-person',
          notes: 'Skin rash examination.',
          symptoms: 'Itchy rash on arms and legs',
          diagnosis: 'Contact dermatitis',
          prescription: 'Hydrocortisone cream 1%, apply twice daily for 7 days',
          followUpDate: '2023-08-20'
        },
        {
          id: '103',
          doctorId: 'd3',
          patientId: 'p1',
          doctor: {
            id: 'd3',
            name: 'Dr. Emily Rodriguez',
            specialty: 'Psychiatrist',
            profileImage: 'https://randomuser.me/api/portraits/women/28.jpg'
          },
          patient: {
            id: 'p1',
            name: 'John Doe',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          date: '2023-08-25',
          startTime: '11:00',
          endTime: '12:00',
          status: 'scheduled',
          type: 'video',
          notes: 'Regular therapy session.'
        },
        {
          id: '104',
          doctorId: 'd4',
          patientId: 'p1',
          doctor: {
            id: 'd4',
            name: 'Dr. Robert Wilson',
            specialty: 'Orthopedic Surgeon',
            profileImage: 'https://randomuser.me/api/portraits/men/52.jpg'
          },
          patient: {
            id: 'p1',
            name: 'John Doe',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          date: '2023-07-10',
          startTime: '09:00',
          endTime: '09:30',
          status: 'completed',
          type: 'in-person',
          notes: 'Post-surgery follow-up.',
          diagnosis: 'Healing well after knee surgery',
          prescription: 'Continue physical therapy twice weekly',
          followUpDate: '2023-09-10'
        },
        {
          id: '105',
          doctorId: 'd1',
          patientId: 'p1',
          doctor: {
            id: 'd1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            profileImage: 'https://randomuser.me/api/portraits/women/76.jpg'
          },
          patient: {
            id: 'p1',
            name: 'John Doe',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          date: '2023-07-05',
          startTime: '11:30',
          endTime: '12:00',
          status: 'cancelled',
          type: 'video',
          notes: 'Initial consultation for heart palpitations.'
        },
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch appointments. Please try again.');
      setLoading(false);
      console.error('Error fetching appointments:', error);
    }
  }, []);
  
  // Get appointment by ID
  const getAppointmentById = useCallback((id: string) => {
    return appointments.find(appointment => appointment.id === id);
  }, [appointments]);
  
  // Book appointment
  const bookAppointment = useCallback(async (appointmentData: Partial<Appointment>): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      
      // Create a new appointment with mock data
      const newAppointment: Appointment = {
        id: `app-${Date.now()}`,
        doctorId: appointmentData.doctorId || '',
        patientId: user?.id || '',
        doctor: appointmentData.doctor || {
          id: '',
          name: '',
          specialty: ''
        },
        patient: {
          id: user?.id || '',
          name: `${user?.firstName} ${user?.lastName}` || '',
          profileImage: user?.profilePicture
        },
        date: appointmentData.date || '',
        startTime: appointmentData.startTime || '',
        endTime: appointmentData.endTime || '',
        status: 'scheduled',
        type: appointmentData.type || 'in-person',
        notes: appointmentData.notes || '',
        symptoms: appointmentData.symptoms || ''
      };
      
      // Add to state
      setAppointments(prev => [...prev, newAppointment]);
      
      return true;
    } catch (error) {
      console.error('Error booking appointment:', error);
      return false;
    }
  }, [user]);
  
  // Cancel appointment
  const cancelAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return false;
    }
  }, []);
  
  // Reschedule appointment
  const rescheduleAppointment = useCallback(async (
    id: string, 
    newDate: string, 
    newStartTime: string, 
    newEndTime: string
  ): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { 
                ...appointment, 
                date: newDate, 
                startTime: newStartTime, 
                endTime: newEndTime 
              } 
            : appointment
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return false;
    }
  }, []);
  
  // Filter appointments
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    return appointmentDate >= new Date() && appointment.status !== 'cancelled';
  });
  
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    return appointmentDate < new Date() || appointment.status === 'cancelled';
  });
  
  // Initialize appointments
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);
  
  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    fetchAppointments,
    getAppointmentById,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment
  };
};