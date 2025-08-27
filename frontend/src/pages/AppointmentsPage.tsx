import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  doctorName: string;
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

const AppointmentsPage: React.FC = () => {
  // Mock data for appointments
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorId: '101',
      specialty: 'Cardiology',
      date: '2023-08-15',
      time: '10:00 AM',
      status: 'confirmed',
      notes: 'Follow-up on recent test results',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorId: '102',
      specialty: 'Dermatology',
      date: '2023-08-18',
      time: '2:30 PM',
      status: 'pending',
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      doctorId: '103',
      specialty: 'Neurology',
      date: '2023-07-30',
      time: '9:15 AM',
      status: 'completed',
      notes: 'Discussed treatment options for migraines',
    },
    {
      id: '4',
      doctorName: 'Dr. James Wilson',
      doctorId: '104',
      specialty: 'Orthopedics',
      date: '2023-07-25',
      time: '11:45 AM',
      status: 'cancelled',
    },
    {
      id: '5',
      doctorName: 'Dr. Lisa Thompson',
      doctorId: '105',
      specialty: 'Psychiatry',
      date: '2023-08-05',
      time: '3:00 PM',
      status: 'no_show',
    },
  ];

  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today && (appointment.status === 'confirmed' || appointment.status === 'pending');
  });
  
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate < today || (appointment.status === 'completed' || appointment.status === 'cancelled' || appointment.status === 'no_show');
  });

  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Appointments
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/doctors"
            className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Book New Appointment
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${activeTab === 'upcoming' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Upcoming
            <span className={`${activeTab === 'upcoming' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900'} ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium`}>
              {upcomingAppointments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`${activeTab === 'past' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Past
            <span className={`${activeTab === 'past' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900'} ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium`}>
              {pastAppointments.length}
            </span>
          </button>
        </nav>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {activeTab === 'upcoming' && upcomingAppointments.length === 0 && (
          <div className="px-4 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No upcoming appointments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by booking a new appointment.</p>
            <div className="mt-6">
              <Link
                to="/doctors"
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Book New Appointment
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'past' && pastAppointments.length === 0 && (
          <div className="px-4 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No past appointments</h3>
            <p className="mt-1 text-sm text-gray-500">Your appointment history will appear here.</p>
          </div>
        )}

        {((activeTab === 'upcoming' && upcomingAppointments.length > 0) || 
          (activeTab === 'past' && pastAppointments.length > 0)) && (
          <ul role="list" className="divide-y divide-gray-200">
            {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{appointment.specialty}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="text-sm text-gray-500">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-500">{appointment.time}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-2 ml-16">
                    <p className="text-sm text-gray-500">{appointment.notes}</p>
                  </div>
                )}
                <div className="mt-4 flex justify-end space-x-3">
                  <Link
                    to={`/appointments/${appointment.id}`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    View Details
                  </Link>
                  {appointment.status === 'confirmed' && (
                    <Link
                      to={`/video-consultation/${appointment.id}`}
                      className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Join Video Call
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;