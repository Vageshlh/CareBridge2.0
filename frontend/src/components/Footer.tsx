import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Logo 
              size="lg" 
              showText={true} 
              textColor="text-white" 
              className="flex items-center"
            />
            <p className="text-sm leading-6 text-gray-300">
              Virtual healthcare platform connecting patients with qualified doctors for convenient, quality healthcare.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Services</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/doctors" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Video Consultations
                    </Link>
                  </li>
                  <li>
                    <Link to="/doctors" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Prescription Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/doctors" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Health Records
                    </Link>
                  </li>
                  <li>
                    <Link to="/doctors" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Specialist Referrals
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="text-sm leading-6 text-gray-300">
                    <span className="font-medium text-white">Phone:</span><br />
                    +1 (555) 123-4567
                  </li>
                  <li className="text-sm leading-6 text-gray-300">
                    <span className="font-medium text-white">Email:</span><br />
                    support@carebridge.com
                  </li>
                  <li className="text-sm leading-6 text-gray-300">
                    <span className="font-medium text-white">Address:</span><br />
                    123 Healthcare Ave<br />
                    Medical District, CA 90210
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-700 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2024 CareBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;