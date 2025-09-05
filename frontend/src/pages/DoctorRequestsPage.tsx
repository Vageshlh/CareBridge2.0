import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface AppointmentRequest {
  id: string;
  patientName: string;
  age: number;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
  reason: string;
  contactInfo: string;
}

const DoctorRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AppointmentRequest[]>([
    {
      id: '1',
      patientName: 'John Smith',
      age: 45,
      date: '2023-08-15',
      time: '10:00 AM',
      status: 'pending',
      reason: 'Chest pain consultation',
      contactInfo: 'john.smith@email.com',
    },
    {
      id: '2',
      patientName: 'Sarah Wilson',
      age: 32,
      date: '2023-08-15',
      time: '2:30 PM',
      status: 'pending',
      reason: 'Follow-up appointment',
      contactInfo: 'sarah.wilson@email.com',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      age: 28,
      date: '2023-08-16',
      time: '9:00 AM',
      status: 'pending',
      reason: 'Skin rash examination',
      contactInfo: 'michael.brown@email.com',
    },
  ]);

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: action === 'accept' ? 'accepted' : 'declined' }
          : request
      )
    );
  };

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const processedRequests = requests.filter(request => request.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Appointment Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming patient appointment requests.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/doctor-dashboard"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h3>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500">No pending requests at the moment.</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{request.patientName}</h4>
                        <p className="text-sm text-gray-500">Age: {request.age}</p>
                        <p className="text-sm text-gray-500">{request.contactInfo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{request.date}</p>
                      <p className="text-sm text-gray-500">{request.time}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'decline')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Recent Actions
            </h3>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.patientName}</p>
                    <p className="text-sm text-gray-500">{request.date} at {request.time}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRequestsPage;