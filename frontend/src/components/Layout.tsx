import React, { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { Avatar } from './Avatar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { menuByRole } from '../constants/menuConfig';

// Navigation item interface
interface NavigationItem {
  name: string;
  href: string;
}

// Navigation items for logged-in users
const getAuthenticatedNavigation = (userType?: string): NavigationItem[] => {
  const role = userType === 'doctor' ? ROLES.DOCTOR : ROLES.PATIENT;
  const menuConfig = menuByRole[role];
  
  return [
    { name: 'Home', href: '/' },
    { name: menuConfig.dashboardName, href: menuConfig.dashboardHref },
    { name: menuConfig.appointmentsName, href: menuConfig.appointmentsHref },
    { name: 'Doctors', href: '/doctors' },
  ];
};

// Navigation items for logged-out users
const publicNavigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Find Doctors', href: '/doctors' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  
  // Memoize navigation to ensure it updates when user changes
  const navigation = useMemo(() => {
    return isAuthenticated ? getAuthenticatedNavigation(user?.userType) : publicNavigation;
  }, [isAuthenticated, user?.userType]);
  
  // Check if the current route is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // If it's an auth page, only render the outlet without the navigation
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Disclosure as="nav" className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/90 shadow-md' : 'bg-white/90 shadow-sm'}`}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <Logo size="md" showText={true} textColor={theme === 'dark' ? 'text-white' : 'text-primary-600'} />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href || 
                        (item.href !== '/' && location.pathname.startsWith(item.href));
                      
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                            ? 'border-primary-500 ' + (theme === 'dark' ? 'text-white' : 'text-gray-900')
                            : 'border-transparent ' + (theme === 'dark' ? 'text-gray-300 hover:border-gray-600 hover:text-white' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700')
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                          aria-label={`Navigate to ${item.name}`}
                          role="menuitem"
                          tabIndex={0}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
                  <ThemeToggle />
                  
                  {isAuthenticated ? (
                    <>
                      {/* Notifications - only show when authenticated */}
                      <Link
                        to={user?.userType === 'doctor' ? '/doctor-notifications' : '/notifications'}
                        className={`rounded-full p-1 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-white text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                        aria-label="View notifications"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </Link>

                      {/* Profile dropdown - only show when authenticated */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className={`flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}>
                            <span className="sr-only">Open user menu</span>
                            <Avatar size="sm" name={localStorage.getItem('firstName') || localStorage.getItem('profileName') || user?.firstName || undefined} />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={React.Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile"
                                  className={`${active ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''} block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    // Handle sign out
                                    localStorage.removeItem('isAuthenticated');
                                    localStorage.removeItem('user');
                                    window.location.href = '/';
                                  }}
                                  className={`${active ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''} block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <>
                      {/* Sign in button - only show when not authenticated */}
                      <Link
                        to="/login"
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        aria-label="Sign in to your account"
                      >
                        Sign in
                      </Link>
                      
                      {/* Get started button - only show when not authenticated */}
                      <Link
                        to="/register"
                        className="ml-2 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label="Create a new account"
                      >
                        Get started
                      </Link>
                    </>
                  )}
                </div>
                
                {/* Mobile menu button */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className={`inline-flex items-center justify-center rounded-md p-2 ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500`}>
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu">
                {isAuthenticated
                  ? getAuthenticatedNavigation(user?.userType).map((item) => {
                      const isActive = location.pathname === item.href || 
                        (item.href !== '/' && location.pathname.startsWith(item.href));
                      
                      return (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.href}
                          className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${isActive
                            ? 'border-primary-500 ' + (theme === 'dark' ? 'bg-primary-900 text-primary-300' : 'bg-primary-50 text-primary-700')
                            : 'border-transparent ' + (theme === 'dark' ? 'text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800')
                          }`}
                        >
                          {item.name}
                        </Disclosure.Button>
                      );
                    })
                  : publicNavigation.map((item) => {
                      const isActive = location.pathname === item.href || 
                        (item.href !== '/' && location.pathname.startsWith(item.href));
                      
                      return (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.href}
                          className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${isActive
                            ? 'border-primary-500 ' + (theme === 'dark' ? 'bg-primary-900 text-primary-300' : 'bg-primary-50 text-primary-700')
                            : 'border-transparent ' + (theme === 'dark' ? 'text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800')
                          }`}
                        >
                          {item.name}
                        </Disclosure.Button>
                      );
                    })}
              </div>
              
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        <span>{user?.firstName?.charAt(0) || 'U'}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                    <Link
                        to="/notifications"
                        className={`rounded-full p-1 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-white text-gray-400 hover:text-gray-500'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                        aria-label="View notifications"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => {
                        // Handle sign out
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className={`block w-full text-left px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="space-y-1 px-4">
                    <Disclosure.Button
                      as={Link}
                      to="/login"
                      className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                    >
                      Sign in
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/login"
                      className="block w-full text-left px-4 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                    >
                      Get started
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="pt-24 pb-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;