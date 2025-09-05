import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface PatientRecord {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  contactInfo: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  lastVisit: string;
  bloodType: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };
  notes: string;
}

const DoctorPatientRecordsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock patient data - in real app, this would be fetched based on the ID
  const [patientRecord] = useState<PatientRecord>({
    id: id || '1',
    patientName: 'John Smith',
    age: 45,
    gender: 'Male',
    contactInfo: 'john.smith@email.com | (555) 123-4567',
    medicalHistory: [
      'Hypertension (2018)',
      'Type 2 Diabetes (2020)',
      'High Cholesterol (2019)'
    ],
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: [
      'Metformin 500mg - Twice daily',
      'Lisinopril 10mg - Once daily',
      'Atorvastatin 20mg - Once daily'
    ],
    lastVisit: '2023-07-15',
    bloodType: 'O+',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '(555) 123-4568'
    },
    vitals: {
      bloodPressure: '140/90 mmHg',
      heartRate: '78 bpm',
      temperature: '98.6°F',
      weight: '185 lbs',
      height: '5\'10"'
    },
    notes: 'Patient reports chest pain during physical activity. Recommended stress test and cardiology consultation.'
  });

  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>([patientRecord.notes]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, `${new Date().toLocaleDateString()}: ${newNote}`]);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patient Records: {patientRecord.patientName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete medical history and current information
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Link
            to="/doctor-dashboard"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Patient Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">{patientRecord.age} years old</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{patientRecord.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{patientRecord.bloodType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact</dt>
              <dd className="mt-1 text-sm text-gray-900">{patientRecord.contactInfo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Visit</dt>
              <dd className="mt-1 text-sm text-gray-900">{patientRecord.lastVisit}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patientRecord.emergencyContact.name} ({patientRecord.emergencyContact.relationship})<br />
                {patientRecord.emergencyContact.phone}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Current Vitals */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Current Vitals</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <dt className="text-sm font-medium text-blue-600">Blood Pressure</dt>
              <dd className="mt-1 text-lg font-semibold text-blue-900">{patientRecord.vitals.bloodPressure}</dd>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <dt className="text-sm font-medium text-green-600">Heart Rate</dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">{patientRecord.vitals.heartRate}</dd>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <dt className="text-sm font-medium text-yellow-600">Temperature</dt>
              <dd className="mt-1 text-lg font-semibold text-yellow-900">{patientRecord.vitals.temperature}</dd>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <dt className="text-sm font-medium text-purple-600">Weight</dt>
              <dd className="mt-1 text-lg font-semibold text-purple-900">{patientRecord.vitals.weight}</dd>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <dt className="text-sm font-medium text-indigo-600">Height</dt>
              <dd className="mt-1 text-lg font-semibold text-indigo-900">{patientRecord.vitals.height}</dd>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Medical History */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Medical History</h3>
            <ul className="space-y-2">
              {patientRecord.medicalHistory.map((condition, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Allergies</h3>
            <ul className="space-y-2">
              {patientRecord.allergies.map((allergy, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <svg className="h-4 w-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {allergy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Current Medications</h3>
          <ul className="space-y-2">
            {patientRecord.currentMedications.map((medication, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {medication}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Doctor Notes */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Doctor Notes</h3>
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="new-note" className="block text-sm font-medium text-gray-700">
              Add New Note
            </label>
            <div className="mt-1 flex space-x-3">
              <textarea
                id="new-note"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter your notes about this patient..."
              />
              <button
                onClick={addNote}
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientRecordsPage;