import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  rating: number;
  profilePicture?: string;
  availability?: string[];
}

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          const mockDoctors: Doctor[] = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Smith',
              specialty: 'Cardiology',
              rating: 4.8,
              profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
              availability: ['Monday', 'Wednesday', 'Friday']
            },
            {
              id: '2',
              firstName: 'Sarah',
              lastName: 'Johnson',
              specialty: 'Neurology',
              rating: 4.9,
              profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
              availability: ['Tuesday', 'Thursday']
            },
            {
              id: '3',
              firstName: 'Michael',
              lastName: 'Brown',
              specialty: 'Dermatology',
              rating: 4.7,
              profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
              availability: ['Monday', 'Tuesday', 'Friday']
            },
            {
              id: '4',
              firstName: 'Emily',
              lastName: 'Davis',
              specialty: 'Pediatrics',
              rating: 4.9,
              profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
              availability: ['Wednesday', 'Thursday', 'Friday']
            },
          ];
          // If user is not authenticated, only show first 2 doctors as preview
          const doctorsToShow = !isAuthenticated ? mockDoctors.slice(0, 2) : mockDoctors;
          setDoctors(doctorsToShow);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [isAuthenticated]);

  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const searchMatch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase());
    const specialtyMatch = specialty === '' || doctor.specialty === specialty;
    return searchMatch && specialtyMatch;
  });

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  const handleBookAppointment = (doctorId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      navigate(`/login?returnTo=/doctors/${doctorId}`);
    } else {
      // Navigate to doctor detail page
      navigate(`/doctors/${doctorId}`);
    }
  };
  
  const handleViewProfile = (doctorId: string) => {
    if (!isAuthenticated) {
      navigate(`/login?returnTo=/doctors/${doctorId}`);
      return;
    }
    
    navigate(`/doctors/${doctorId}`);
  };
  
  const handleContactDoctor = (doctorId: string) => {
    if (!isAuthenticated) {
      navigate(`/login?returnTo=/doctors/${doctorId}`);
      return;
    }
    
    navigate(`/doctors/${doctorId}/contact`);
  };

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Find Doctors</h1>
            <p className="mt-2 text-sm text-gray-700">
              Browse our network of qualified healthcare professionals and book an appointment.
            </p>
          </div>
        </div>
        
        {!isAuthenticated && (
          <div className="mt-4 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">Sign in or register to book appointments and see more doctors.</p>
                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                  <Link to="/login" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                    Sign in <span aria-hidden="true">&rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select 
          className="md:max-w-[300px] w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={specialty}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpecialty(e.target.value)}
        >
          <option value="">Filter by specialty</option>
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <p className="text-center text-lg mt-10">No doctors found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="block">
                <div className="border border-gray-200 rounded-lg overflow-hidden p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row items-center">
                    <img
                      src={doctor.profilePicture || 'https://via.placeholder.com/150'}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="rounded-full w-[100px] h-[100px] object-cover sm:mr-4 mb-4 sm:mb-0"
                    />
                    <div className="flex flex-col space-y-2 flex-1">
                      <h2 className="text-lg font-medium">{doctor.firstName} {doctor.lastName}</h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doctor.specialty}
                      </span>
                      <div className="flex items-center">
                        <span>Rating:</span>
                        <span className="font-bold ml-1">{doctor.rating}/5</span>
                      </div>
                      {doctor.availability && (
                        <p className="text-sm text-gray-600">
                          Available: {doctor.availability.join(', ')}
                        </p>
                      )}
                      <div className="mt-2 space-y-2">
                        <button
                          onClick={() => handleViewProfile(doctor.id)}
                          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={(e) => handleBookAppointment(doctor.id, e)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                        >
                          {!isAuthenticated && <LockClosedIcon className="h-4 w-4 mr-1" />}
                          Book Appointment
                        </button>
                        <button
                          onClick={() => handleContactDoctor(doctor.id)}
                          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                        >
                          Contact Doctor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;