import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  patientName: string;
  patientAge: number;
  date: string;
  diagnosis: string;
  medications: Medication[];
  doctorNotes: string;
}

const DoctorPrescriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [prescription, setPrescription] = useState<Prescription>({
    patientName: 'John Smith',
    patientAge: 45,
    date: new Date().toLocaleDateString(),
    diagnosis: '',
    medications: [],
    doctorNotes: ''
  });

  const [newMedication, setNewMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication = {
        ...newMedication,
        id: Date.now().toString()
      };
      setPrescription(prev => ({
        ...prev,
        medications: [...prev.medications, medication]
      }));
      setNewMedication({
        id: '',
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const removeMedication = (medicationId: string) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== medicationId)
    }));
  };

  const generatePrescription = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      alert('Prescription generated and sent to patient!');
    }, 2000);
  };

  const commonMedications = [
    'Amoxicillin',
    'Ibuprofen',
    'Acetaminophen',
    'Lisinopril',
    'Metformin',
    'Atorvastatin',
    'Omeprazole',
    'Aspirin',
    'Prednisone',
    'Azithromycin'
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Generate Prescription
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a new prescription for {prescription.patientName}
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

      {/* Patient Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <p className="mt-1 text-sm text-gray-900">{prescription.patientName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <p className="mt-1 text-sm text-gray-900">{prescription.patientAge} years</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <p className="mt-1 text-sm text-gray-900">{prescription.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Diagnosis</h3>
          <textarea
            rows={3}
            value={prescription.diagnosis}
            onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter diagnosis..."
          />
        </div>
      </div>

      {/* Add Medication */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Medication</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="medication-name" className="block text-sm font-medium text-gray-700">
                Medication Name
              </label>
              <input
                type="text"
                id="medication-name"
                list="common-medications"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter medication name"
              />
              <datalist id="common-medications">
                {commonMedications.map((med) => (
                  <option key={med} value={med} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                id="dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 500mg"
              />
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select
                id="frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                value={newMedication.duration}
                onChange={(e) => setNewMedication(prev => ({ ...prev, duration: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 7 days, 2 weeks"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Special Instructions
              </label>
              <input
                type="text"
                id="instructions"
                value={newMedication.instructions}
                onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., Take with food, Avoid alcohol"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={addMedication}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Medications List */}
      {prescription.medications.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Prescribed Medications</h3>
            <div className="space-y-4">
              {prescription.medications.map((medication) => (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{medication.name}</h4>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Frequency:</span> {medication.frequency}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Duration:</span> {medication.duration}
                        </p>
                      </div>
                      {medication.instructions && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeMedication(medication.id)}
                      className="ml-4 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Notes */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Doctor Notes</h3>
          <textarea
            rows={4}
            value={prescription.doctorNotes}
            onChange={(e) => setPrescription(prev => ({ ...prev, doctorNotes: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Additional notes for the patient..."
          />
        </div>
      </div>

      {/* Generate Prescription */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Generate Prescription</h3>
              <p className="mt-1 text-sm text-gray-500">
                Review all information and generate the prescription for the patient.
              </p>
            </div>
            <button
              onClick={generatePrescription}
              disabled={isGenerating || prescription.medications.length === 0 || !prescription.diagnosis}
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Prescription'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptionPage;