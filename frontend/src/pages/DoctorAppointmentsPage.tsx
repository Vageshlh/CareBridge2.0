import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CalendarModal from '../components/CalendarModal';

interface PendingRequest {
  id: string;
  patientName: string;
  requestedTime: string;
  email: string;
}

const DoctorAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: '1',
      patientName: 'Emma Wilson',
      requestedTime: 'Tomorrow 3:00 PM',
      email: 'emma.wilson@email.com'
    },
    {
      id: '2',
      patientName: 'Robert Brown',
      requestedTime: 'Friday 10:00 AM',
      email: 'robert.brown@email.com'
    }
  ]);

  const handleAppointmentAction = (requestId: string, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      alert(`Appointment request accepted successfully!`);
    } else {
      alert(`Appointment request declined.`);
    }
    
    // Remove the request from pending list
    setPendingRequests(prev => prev.filter(request => request.id !== requestId));
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'calendar':
        // Open calendar modal
        setIsCalendarModalOpen(true);
        break;
      case 'availability':
        // For now, show availability management info
        alert('Availability management: You can set your working hours and available time slots here. This feature will be fully implemented soon.');
        break;
      case 'records':
        // Navigate to a sample patient record
        navigate('/doctor-patient-records/john-smith');
        break;
      case 'report':
        // Generate a sample report
        alert('Generating appointment report... This will include statistics about your appointments, patient visits, and consultation summaries.');
        break;
      default:
        break;
    }
  };

  const handleViewDetails = (patientName: string, patientId?: string) => {
    // Navigate to patient records page with patient ID
    const id = patientId || patientName.toLowerCase().replace(' ', '-');
    navigate(`/doctor-patient-records/${id}`);
  };

  const handleJoinCall = (patientName: string) => {
    navigate(`/video-consultation/sarah-johnson`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Doctor Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your patient appointments, Dr. {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Today's Appointments
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              8 appointments
            </span>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-gray-900 dark:text-white">John Smith</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">10:00 AM - Chest pain consultation</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">11:30 AM - Follow-up checkup</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium text-gray-900 dark:text-white">Mike Davis</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">2:00 PM - Initial consultation</p>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Requests
            </h2>
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
              {pendingRequests.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending requests</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="border border-orange-200 dark:border-orange-700 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-white">{request.patientName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Requested: {request.requestedTime}</p>
                  <div className="mt-2 flex space-x-2">
                    <button 
                      onClick={() => handleAppointmentAction(request.id, 'accept')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAppointmentAction(request.id, 'decline')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('calendar')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              View Calendar
            </button>
            <button 
              onClick={() => handleQuickAction('availability')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Set Availability
            </button>
            <button 
              onClick={() => handleQuickAction('records')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Patient Records
            </button>
            <button 
              onClick={() => handleQuickAction('report')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">John Smith</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">john.smith@email.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Today, 10:00 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Consultation
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails('John Smith', 'john-smith')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Sarah Johnson</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">sarah.j@email.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Today, 11:30 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Follow-up
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleJoinCall('Sarah Johnson')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                  >
                    Join Call
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Calendar Modal */}
      <CalendarModal 
        isOpen={isCalendarModalOpen} 
        onClose={() => setIsCalendarModalOpen(false)} 
      />
    </div>
  );
};

export default DoctorAppointmentsPage;