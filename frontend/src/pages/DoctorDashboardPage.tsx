import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboardPage: React.FC = () => {
  // Get doctor name from localStorage
  const doctorName = localStorage.getItem('firstName') || localStorage.getItem('profileName') || 'Doctor';
  
  // State for managing availability
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Mock data for doctor dashboard
  const appointmentRequests = [
    {
      id: '1',
      patientName: 'John Smith',
      age: 45,
      date: '2023-08-15',
      time: '10:00 AM',
      status: 'pending',
      reason: 'Chest pain consultation',
    },
    {
      id: '2',
      patientName: 'Sarah Wilson',
      age: 32,
      date: '2023-08-15',
      time: '2:30 PM',
      status: 'confirmed',
      reason: 'Follow-up appointment',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      age: 28,
      date: '2023-08-16',
      time: '9:00 AM',
      status: 'pending',
      reason: 'Skin rash examination',
    },
  ];

  const recentNotifications = [
    {
      id: '1',
      message: 'New appointment request from John Smith.',
      time: '30 minutes ago',
      read: false,
    },
    {
      id: '2',
      message: 'Patient Sarah Wilson left a 5-star review.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      message: 'Appointment with Michael Brown in 30 minutes.',
      time: '4 hours ago',
      read: true,
    },
  ];

  const todayStats = {
    totalAppointments: 8,
    completedAppointments: 5,
    pendingRequests: appointmentRequests.filter(apt => apt.status === 'pending').length,
    earnings: 1250,
  };

  const [appointments, setAppointments] = useState(appointmentRequests);

  const handleAppointmentAction = (appointmentId: string, action: 'accept' | 'decline' | 'reschedule') => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => {
        if (appointment.id === appointmentId) {
          if (action === 'accept') {
            return { ...appointment, status: 'confirmed' };
          } else if (action === 'decline') {
            // Remove declined appointments from the list
            return null;
          } else if (action === 'reschedule') {
            // For now, just mark as pending with a note
            alert('Reschedule functionality - Please contact the patient to arrange a new time.');
            return appointment;
          }
        }
        return appointment;
      }).filter(Boolean) as typeof appointmentRequests
    );
    
    if (action === 'accept') {
      alert('Appointment accepted successfully!');
    } else if (action === 'decline') {
      alert('Appointment declined.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, Dr. {doctorName}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's your practice overview for today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`mr-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isAvailable
                ? 'bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600'
                : 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:outline-gray-600'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>
          <Link
            to="/profile"
            className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Today's Appointments</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{todayStats.totalAppointments}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <div className="text-sm">
              <Link to="/doctor-appointments" className="font-medium text-primary-600 hover:text-primary-500">
                View all appointments
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Pending Requests</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {todayStats.pendingRequests}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <div className="text-sm">
              <Link to="/doctor-requests" className="font-medium text-primary-600 hover:text-primary-500">
                Review requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Completed Today */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Completed Today</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{todayStats.completedAppointments}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       width="16" height="16" 
                       fill="currentColor" 
                       className="h-4 w-4 text-white" 
                       viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Today's Earnings</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">₹{todayStats.earnings}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Requests List */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Appointment Requests</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage incoming patient appointment requests.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
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
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">Age: {appointment.age} • {appointment.reason}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className="text-sm text-gray-500">{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-500">{appointment.time}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    {appointment.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'decline')}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'reschedule')}
                          className="inline-flex items-center rounded-md border border-primary-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-primary-700 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'accept')}
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Accept
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/doctor-patient-records/${appointment.id}`}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          View Patient Records
                        </Link>
                        <Link
                          to={`/doctor-prescription/${appointment.id}`}
                          className="inline-flex items-center rounded-md border border-primary-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-primary-700 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Generate Prescription
                        </Link>
                        <Link
                          to={`/video-consultation/${appointment.id}`}
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Start Consultation
                        </Link>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No appointment requests at the moment.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Notifications</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your latest updates and alerts.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <li key={notification.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-primary-100 text-primary-600'}`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className={`text-sm ${notification.read ? 'text-gray-500' : 'font-medium text-gray-900'}`}>
                          {notification.message}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{notification.time}</div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="ml-4 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No recent notifications.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;