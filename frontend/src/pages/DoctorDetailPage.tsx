import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  education: string[];
  experience: string[];
  rating: number;
  reviews: Review[];
  profilePicture?: string;
  availability: {
    day: string;
    slots: string[];
  }[];
  bio: string;
}

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data for the doctor
          const mockDoctor: Doctor = {
            id: id || '1',
            firstName: 'John',
            lastName: 'Smith',
            specialty: 'Cardiology',
            education: [
              'MD, Harvard Medical School',
              'Residency, Massachusetts General Hospital',
              'Fellowship in Cardiology, Johns Hopkins Hospital'
            ],
            experience: [
              'Chief of Cardiology, Memorial Hospital (2015-Present)',
              'Associate Professor, University Medical Center (2010-2015)',
              'Staff Cardiologist, City General Hospital (2005-2010)'
            ],
            rating: 4.8,
            profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
            availability: [
              { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'] },
              { day: 'Wednesday', slots: ['9:00 AM', '11:00 AM', '1:00 PM'] },
              { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '4:00 PM'] }
            ],
            bio: 'Dr. John Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions. He specializes in preventive cardiology, heart failure management, and cardiac rehabilitation. Dr. Smith is known for his patient-centered approach and dedication to providing comprehensive care.',
            reviews: [
              {
                id: '1',
                patientName: 'Michael Johnson',
                rating: 5,
                comment: 'Dr. Smith was very thorough and took the time to explain everything to me. Highly recommend!',
                date: '2023-05-15'
              },
              {
                id: '2',
                patientName: 'Sarah Williams',
                rating: 4,
                comment: 'Great doctor, very knowledgeable. The wait time was a bit long though.',
                date: '2023-04-22'
              },
              {
                id: '3',
                patientName: 'Robert Brown',
                rating: 5,
                comment: 'Dr. Smith helped me manage my heart condition effectively. I feel much better now!',
                date: '2023-03-10'
              }
            ]
          };
          setDoctor(mockDoctor);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setIsLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      // Show toast message
      alert('Please log in to book an appointment');
      navigate('/login');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleSubmitAppointment = () => {
    // In a real app, this would make an API call to book the appointment
    if (!selectedDay || !selectedTime || !reason) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate successful booking
    alert(`Your appointment with Dr. ${doctor?.firstName} ${doctor?.lastName} on ${selectedDay} at ${selectedTime} has been scheduled.`);
    
    setIsModalOpen(false);
    // In a real app, you might redirect to appointments page
    // navigate('/appointments');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-10 px-6">
        <h2 className="text-2xl font-bold mt-6 mb-2">
          Doctor Not Found
        </h2>
        <p className="text-gray-500">
          The doctor you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => navigate('/doctors')}
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button 
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => navigate('/doctors')}
      >
        Back to Doctors
      </button>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden p-6 mb-6">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mb-6 items-start">
          <img
            src={doctor.profilePicture || 'https://via.placeholder.com/200'}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            className="rounded-md w-[100px] h-[100px] md:w-[200px] md:h-[200px] object-cover"
          />
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl font-bold">{doctor.firstName} {doctor.lastName}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {doctor.specialty}
            </span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2">{doctor.rating}/5</span>
            </div>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <h2 className="text-lg font-medium mb-3">About</h2>
        <p className="mb-4">{doctor.bio}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Education</h2>
            <div className="flex flex-col space-y-2">
              {doctor.education.map((edu, index) => (
                <p key={index}>{edu}</p>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Experience</h2>
            <div className="flex flex-col space-y-2">
              {doctor.experience.map((exp, index) => (
                <p key={index}>{exp}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctor.availability.map((avail) => (
            <div key={avail.day} className="p-3 border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium mb-2">{avail.day}</h3>
              <div className="flex flex-wrap">
                {avail.slots.map((slot) => (
                  <span key={slot} className="m-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden p-6">
        <h2 className="text-lg font-medium mb-4">Patient Reviews ({doctor.reviews.length})</h2>
        <div className="flex flex-col space-y-4">
          {doctor.reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium">{review.patientName}</h3>
                <span className="text-sm text-gray-500 ml-2">{review.date}</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Appointment Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-medium">Book an Appointment</h2>
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Day</label>
                  <select 
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedDay}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDay(e.target.value)}
                  >
                    <option value="">Select day</option>
                    {doctor.availability.map((avail) => (
                      <option key={avail.day} value={avail.day}>{avail.day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                  <select 
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedTime}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(e.target.value)}
                    disabled={!selectedDay}
                  >
                    <option value="">Select time</option>
                    {selectedDay && doctor.availability
                      .find(avail => avail.day === selectedDay)?.slots
                      .map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                  <textarea 
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please describe your symptoms or reason for the appointment"
                    value={reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleSubmitAppointment}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetailPage;