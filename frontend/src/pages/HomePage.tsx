import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import WorkflowCard from '../components/WorkflowCard';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash scrolling on mount and route changes
    const hash = location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div 
        className="relative isolate min-h-[70vh] flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.4) 0%, rgba(135, 206, 235, 0.3) 50%, rgba(176, 224, 230, 0.2) 100%)'
        }}
      >
        {/* Content Container */}
        <div className="relative z-10 px-6 pt-14 lg:px-8 mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
            {/* 3D Doctor Image - Left side on desktop */}
             <div className="order-2 md:order-1 flex justify-center md:justify-start">
               <div className="relative w-full max-w-lg md:max-w-xl">
                 <img 
                   src="https://famedico.com/wp-content/uploads/2025/02/happy-doctor-holding-clipboard-with-patients-min-1536x1024.jpg"
                   alt="Healthcare Professional"
                   className="w-full h-auto rounded-lg shadow-lg"
                   style={{
                     transform: 'scale(1.0)',
                     filter: 'none',
                     transformOrigin: 'center center'
                   }}
                 />
               </div>
             </div>

            {/* Text content - Right side on desktop */}
               <div className="order-1 md:order-2 text-center md:text-left">
              <div className="mb-6">
                <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase" style={{ color: '#4285f4' }}>COMMITTED TO SUCCESS</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight" style={{ color: '#000000' }}>
                Healthcare at your<br />fingertips
              </h1>
              <p className="text-lg leading-7 mb-8 max-w-xl mx-auto md:mx-0" style={{ color: '#64748b' }}>
                Connect with qualified doctors from the comfort of your home. Book appointments, have video consultations, and get prescriptions online.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
                <Link
                  to="/register"
                  className="w-full sm:w-auto rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 text-center bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  Get started
                </Link>
                <Link to="/doctors" className="w-full sm:w-auto text-lg font-semibold leading-6 hover:text-blue-600 transition-colors text-center" style={{ color: '#64748b' }}>
                  Find doctors <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How CareBridge Works section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How CareBridge Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Getting healthcare has never been easier. Follow these simple steps to connect with a doctor.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <WorkflowCard
                 step={1}
                 title="Find a Doctor"
                 description="Browse our network of qualified healthcare professionals by specialty, location, or availability."
               />
 
               <WorkflowCard
                 step={2}
                 title="Book Appointment"
                 description="Schedule your consultation at a time that works for you with our easy booking system."
               />
 
               <WorkflowCard
                 step={3}
                 title="Connect Securely"
                 description="Join your secure video consultation from anywhere and receive personalized care."
               />
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Better Healthcare</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your health
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              CareBridge provides a comprehensive telemedicine platform that connects patients with doctors for virtual consultations, appointment scheduling, and more.
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 items-stretch">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="24/7 Availability"
                description="Access healthcare services anytime, anywhere. Our platform is available 24/7 for your convenience."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                }
                title="Qualified Doctors"
                description="Connect with verified and experienced healthcare professionals specializing in various fields."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                }
                title="Secure Consultations"
                description="Our platform ensures private and secure video consultations with end-to-end encryption."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                  </svg>
                }
                title="Digital Prescriptions"
                description="Receive digital prescriptions directly through the platform after your consultation."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose CareBridge section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Excellence in Care</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose CareBridge?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're committed to providing the highest quality healthcare experience with cutting-edge technology and compassionate care.
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 items-stretch">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                }
                title="HD Video Consultations"
                description="Crystal-clear video quality ensures you can communicate effectively with your healthcare provider from the comfort of your home."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="24/7 Availability"
                description="Access healthcare services anytime, anywhere with our round-the-clock support and on-demand consultations."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3.7-3.7a9.016 9.016 0 0 1 3.7 3.7M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63 2.39 1.593 3.068a3.745 3.745 0 0 1 1.043 3.296 3.746 3.746 0 0 1 3.296 1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
                  </svg>
                }
                title="Secure & Private"
                description="HIPAA-compliant platform ensuring your medical information stays confidential with end-to-end encryption."
              />
              
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                }
                title="AI-Powered Insights"
                description="CareBridge uses modern ML to power smart chat support and assist clinicians with pattern detection (e.g., X-ray insights)."
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              How CareBridge Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Get quality healthcare in three simple steps
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Book Appointment</h3>
                <p className="text-slate-600 dark:text-slate-300">Choose your preferred doctor and schedule a convenient time for your consultation.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Video Consultation</h3>
                <p className="text-slate-600 dark:text-slate-300">Connect with your doctor through our secure video platform from anywhere.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Get Treatment</h3>
                <p className="text-slate-600 dark:text-slate-300">Receive your diagnosis, treatment plan, and digital prescriptions instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties section */}
      <div className="bg-white dark:bg-slate-800 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Medical Specialties
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Connect with specialists across various medical fields
            </p>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Mental Health', 'Orthopedics', 'Gynecology', 'Neurology'].map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/40 px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-slate-600 dark:text-slate-300">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-300">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">4.9</div>
              <div className="text-slate-600 dark:text-slate-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-300">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar section */}
      <div className="bg-white dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trusted by Healthcare Leaders</h3>
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Partner 1
            </div>
            <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Partner 2
            </div>
            <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Partner 3
            </div>
            <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Partner 4
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm">
              <blockquote className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-6">
                "CareBridge made it so easy to get the medical care I needed. The video consultation was clear, and my doctor was very professional. I received my prescription within minutes!"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-4">
                  SM
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Sarah Mitchell</div>
                  <div className="text-slate-600 dark:text-slate-300">Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About section */}
      <div id="about" className="bg-white dark:bg-slate-800 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-8">
              About CareBridge
            </h2>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 mb-8">
              CareBridge is a revolutionary telemedicine platform that bridges the gap between patients and healthcare providers. 
              Our mission is to make quality healthcare accessible, convenient, and affordable for everyone, regardless of location or schedule.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Our Vision</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  To create a world where healthcare is accessible to everyone, everywhere. We believe that distance and time 
                  should never be barriers to receiving quality medical care.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  To connect patients with qualified healthcare professionals through secure, user-friendly technology, 
                  ensuring personalized care and improved health outcomes for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div id="contact" className="bg-slate-50 dark:bg-slate-900 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-4">
                Contact Us
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Have questions? We're here to help. Reach out to us through any of the following channels.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-6">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Phone</h3>
                <p className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Available 24/7</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-6">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Email</h3>
                <p className="text-slate-600 dark:text-slate-300">support@carebridge.com</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Response within 24 hours</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-6">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Address</h3>
                <p className="text-slate-600 dark:text-slate-300">123 Healthcare Ave</p>
                <p className="text-slate-600 dark:text-slate-300">Medical District, CA 90210</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-blue-600 to-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of patients who trust CareBridge for convenient, quality healthcare.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                to="/register"
                className="w-full sm:w-auto rounded-md bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-colors text-center"
              >
                Book Consultation
              </Link>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto text-base font-semibold leading-6 text-white hover:text-blue-100 transition-colors text-center bg-transparent border-none cursor-pointer"
              >
                Learn More <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;