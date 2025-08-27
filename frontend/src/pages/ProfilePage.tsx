import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  userType: 'patient' | 'doctor';
  specialty?: string;
  licenseNumber?: string;
  bio?: string;
  profilePicture?: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in a real app, this would come from an API
  const [user, setUser] = useState<UserProfile>({
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    userType: 'patient',
    profilePicture: '',
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZIP code is required'),
    specialty: user.userType === 'doctor' ? Yup.string().required('Specialty is required') : Yup.string(),
    licenseNumber: user.userType === 'doctor' ? Yup.string().required('License number is required') : Yup.string(),
  });

  const handleSubmit = (values: UserProfile) => {
    // In a real app, you would send this data to your API
    setUser(values);
    setIsEditing(false);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({
          ...user,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <div className="mt-2 flex items-center space-x-5">
                  <div className="flex-shrink-0">
                    {user.profilePicture ? (
                      <img
                        className="h-24 w-24 rounded-full object-cover"
                        src={user.profilePicture}
                        alt="Profile"
                      />
                    ) : (
                      <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <label htmlFor="profile-picture-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Change
                      </label>
                      <input
                        id="profile-picture-upload"
                        name="profile-picture-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {isEditing ? (
                <Formik
                  initialValues={user}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone number
                          </label>
                          <Field
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                            Date of birth
                          </label>
                          <Field
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Street address
                          </label>
                          <Field
                            type="text"
                            name="address"
                            id="address"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <Field
                            type="text"
                            name="city"
                            id="city"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State / Province
                          </label>
                          <Field
                            type="text"
                            name="state"
                            id="state"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                            ZIP / Postal code
                          </label>
                          <Field
                            type="text"
                            name="zipCode"
                            id="zipCode"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="zipCode" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {user.userType === 'doctor' && (
                          <>
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                Specialty
                              </label>
                              <Field
                                type="text"
                                name="specialty"
                                id="specialty"
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="specialty" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                                License Number
                              </label>
                              <Field
                                type="text"
                                name="licenseNumber"
                                id="licenseNumber"
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="licenseNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="col-span-6">
                              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Professional Bio
                              </label>
                              <Field
                                as="textarea"
                                name="bio"
                                id="bio"
                                rows={4}
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <h3 className="text-sm font-medium text-gray-500">First name</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <h3 className="text-sm font-medium text-gray-500">Last name</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <h3 className="text-sm font-medium text-gray-500">Email address</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <h3 className="text-sm font-medium text-gray-500">Phone number</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <h3 className="text-sm font-medium text-gray-500">Date of birth</h3>
                      <p className="mt-1 text-sm text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    </div>

                    <div className="col-span-6">
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.address}, {user.city}, {user.state} {user.zipCode}
                      </p>
                    </div>

                    {user.userType === 'doctor' && (
                      <>
                        <div className="col-span-6 sm:col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">Specialty</h3>
                          <p className="mt-1 text-sm text-gray-900">{user.specialty || 'Not specified'}</p>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">License Number</h3>
                          <p className="mt-1 text-sm text-gray-900">{user.licenseNumber || 'Not specified'}</p>
                        </div>

                        <div className="col-span-6">
                          <h3 className="text-sm font-medium text-gray-500">Professional Bio</h3>
                          <p className="mt-1 text-sm text-gray-900">{user.bio || 'No bio provided.'}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            <p className="mt-1 text-sm text-gray-600">
              Decide which communications you'd like to receive.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900">By Email</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="appointment_reminders"
                        name="appointment_reminders"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="appointment_reminders" className="font-medium text-gray-700">
                        Appointment reminders
                      </label>
                      <p className="text-gray-500">Get notified about your upcoming appointments.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="messages"
                        name="messages"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="messages" className="font-medium text-gray-700">
                        Messages
                      </label>
                      <p className="text-gray-500">Get notified when you receive new messages.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="updates"
                        name="updates"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="updates" className="font-medium text-gray-700">
                        Platform updates
                      </label>
                      <p className="text-gray-500">Get notified about new features and improvements.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <div>
                  <legend className="text-base font-medium text-gray-900">Push Notifications</legend>
                  <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="push_everything"
                      name="push_notifications"
                      type="radio"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="push_everything" className="ml-3 block text-sm font-medium text-gray-700">
                      Everything
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push_email"
                      name="push_notifications"
                      type="radio"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="push_email" className="ml-3 block text-sm font-medium text-gray-700">
                      Same as email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push_nothing"
                      name="push_notifications"
                      type="radio"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="push_nothing" className="ml-3 block text-sm font-medium text-gray-700">
                      No push notifications
                    </label>
                  </div>
                </div>
              </fieldset>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;