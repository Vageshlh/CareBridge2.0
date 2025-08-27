import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  content: string;
  timestamp: string;
  read: boolean;
}

interface File {
  id: string;
  name: string;
  size: string;
  uploadedBy: 'doctor' | 'patient';
  uploadedAt: string;
  type: string;
  url: string;
}

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  
  // Mock appointment data
  const appointment = {
    id,
    doctorName: 'Dr. Sarah Johnson',
    doctorId: '101',
    doctorSpecialty: 'Cardiology',
    doctorProfilePic: '',
    patientName: 'John Doe',
    patientId: '201',
    date: '2023-08-15',
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'Follow-up on recent test results',
    createdAt: '2023-07-20T14:30:00Z',
  };
  
  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'system',
      content: 'Appointment has been scheduled.',
      timestamp: '2023-07-20T14:30:00Z',
      read: true,
    },
    {
      id: '2',
      sender: 'doctor',
      content: 'Hello John, please make sure to bring your recent test results to our appointment.',
      timestamp: '2023-07-21T09:15:00Z',
      read: true,
    },
    {
      id: '3',
      sender: 'patient',
      content: 'Sure, Dr. Johnson. I will bring all the reports.',
      timestamp: '2023-07-21T10:30:00Z',
      read: true,
    },
    {
      id: '4',
      sender: 'system',
      content: 'Appointment has been confirmed.',
      timestamp: '2023-07-22T11:45:00Z',
      read: true,
    },
  ]);
  
  // Mock files
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'Blood Test Results.pdf',
      size: '2.4 MB',
      uploadedBy: 'patient',
      uploadedAt: '2023-07-21T10:35:00Z',
      type: 'application/pdf',
      url: '#',
    },
    {
      id: '2',
      name: 'ECG Report.pdf',
      size: '1.8 MB',
      uploadedBy: 'patient',
      uploadedAt: '2023-07-21T10:36:00Z',
      type: 'application/pdf',
      url: '#',
    },
    {
      id: '3',
      name: 'Treatment Plan.docx',
      size: '1.2 MB',
      uploadedBy: 'doctor',
      uploadedAt: '2023-07-22T14:20:00Z',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      url: '#',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'patient', // Assuming the current user is the patient
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    const newFile: File = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedBy: 'patient', // Assuming the current user is the patient
      uploadedAt: new Date().toISOString(),
      type: file.type,
      url: '#', // In a real app, this would be the URL after uploading to server
    };
    
    setFiles([...files, newFile]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  const getStatusBadgeClass = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    } else if (fileType.includes('image')) {
      return (
        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Appointment Details
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/appointments"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to Appointments
          </Link>
          {appointment.status === 'confirmed' && (
            <Link
              to={`/video-consultation/${appointment.id}`}
              className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Join Video Call
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Appointment Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your appointment with {appointment.doctorName}.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Doctor</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.doctorName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Specialty</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.doctorSpecialty}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(appointment.date)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.time}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created On</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(appointment.createdAt)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.notes || 'No notes provided.'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Messages */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Messages</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Communication between you and {appointment.doctorName}.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-md rounded-lg px-4 py-2 ${message.sender === 'system' 
                      ? 'bg-gray-100 text-gray-700' 
                      : message.sender === 'doctor' 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}
                  >
                    {message.sender === 'system' && (
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-xs font-medium text-gray-500">System Message</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="mt-1 text-right">
                      <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Files</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Documents shared between you and {appointment.doctorName}.</p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {files.length > 0 ? (
                files.map((file) => (
                  <li key={file.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <div className="flex text-xs text-gray-500">
                            <p>{file.size}</p>
                            <span className="mx-1">•</span>
                            <p>Uploaded by {file.uploadedBy === 'doctor' ? appointment.doctorName : 'You'}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <a
                          href={file.url}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500">No files shared yet.</li>
              )}
            </ul>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Upload a file to share with {appointment.doctorName}</span>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload File
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;