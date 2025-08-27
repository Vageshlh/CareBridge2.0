import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-red-600">403</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button 
            variant="secondary" 
            size="lg" 
            isFullWidth 
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Link to="/dashboard">
            <Button variant="primary" size="lg" isFullWidth>
              Go to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;