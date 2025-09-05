import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/animations.css';
import { useToast } from '../components/Toast';

const PatientSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  userType: Yup.string().oneOf(['patient', 'doctor']).required('User type is required'),
  agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const DoctorSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  medicalLicense: Yup.string().required('Medical license number is required'),
  userType: Yup.string().oneOf(['patient', 'doctor']).required('User type is required'),
  agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  medicalLicense?: string;
  userType: 'patient' | 'doctor';
  agreeTerms: boolean;
}

const getPasswordStrength = (password: string): { strength: 'Weak' | 'Medium' | 'Strong'; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score < 3) return { strength: 'Weak', color: 'text-red-500' };
  if (score < 5) return { strength: 'Medium', color: 'text-yellow-500' };
  return { strength: 'Strong', color: 'text-green-500' };
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addToast } = useToast();

  const initialValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    medicalLicense: '',
    userType: 'patient',
    agreeTerms: false,
  };

  const handleGoogleSignIn = () => {
    addToast({
      type: 'warning',
      message: 'Google sign-in will be available soon.',
      duration: 3000
    });
  };

  const handleFacebookSignIn = () => {
    addToast({
      type: 'warning',
      message: 'Facebook sign-in will be available soon.',
      duration: 3000
    });
  };

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting, setErrors }: { setSubmitting: (isSubmitting: boolean) => void; setErrors: (errors: Partial<Record<string, string>>) => void }) => {
    try {
      // TODO: Implement actual registration API call
      console.log('Registration values:', values);
      
      // Store profile name in localStorage for later use
      localStorage.setItem('profileName', `${values.firstName} ${values.lastName}`);
      localStorage.setItem('firstName', values.firstName);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store user data with userType for proper redirection
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        userType: values.userType
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to appropriate dashboard based on user type
      const redirectPath = values.userType === 'doctor' ? '/doctor-dashboard' : '/dashboard';
      navigate(redirectPath);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 backdrop-blur-sm flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(219, 234, 254, 0.1) 0%, transparent 50%)'}}>


      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center space-x-2 mb-8">
          <button
            type="button"
            className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
              userType === 'patient'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-500'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => setUserType('patient')}
          >
            I am a Patient
          </button>
          <button
            type="button"
            className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
              userType === 'doctor'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-2 border-green-500'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
            onClick={() => setUserType('doctor')}
          >
            I am a Doctor
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          
          <Formik
            initialValues={{...initialValues, userType}}
            validationSchema={userType === 'patient' ? PatientSchema : DoctorSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6 transition-all duration-500 ease-in-out">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        className={`block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
                          errors.firstName && touched.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        className={`block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
                          errors.lastName && touched.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
                        errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
                        errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {values.password && (
                    <div className="mt-2">
                      <div className={`text-sm font-medium ${getPasswordStrength(values.password).color}`}>
                        Strength: {getPasswordStrength(values.password).strength}
                      </div>
                    </div>
                  )}
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`block w-full appearance-none rounded-lg border px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
                        errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {userType === 'doctor' && (
                  <div className="animate-fade-in">
                    <label htmlFor="medicalLicense" className="block text-sm font-medium text-gray-700">
                      Medical License Number
                    </label>
                    <div className="mt-1">
                      <Field
                        id="medicalLicense"
                        name="medicalLicense"
                        type="text"
                        placeholder="Enter your medical license number"
                        className={`block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm transition-colors ${
                          errors.medicalLicense && touched.medicalLicense ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="medicalLicense" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                )}

                <Field type="hidden" name="userType" value={userType} />

                <div className="flex items-center">
                  <Field
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <ErrorMessage name="agreeTerms" component="div" className="mt-1 text-sm text-red-600" />

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full justify-center rounded-lg border border-transparent py-3 px-4 text-sm font-medium text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 ${
                      userType === 'patient'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500'
                    }`}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                  </button>
                </div>

                {/* Social Sign-In */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="ml-2">Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFacebookSignIn}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="ml-2">Facebook</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;