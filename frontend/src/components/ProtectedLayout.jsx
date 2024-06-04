import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="min-h-screen text-white">
      <header className="flex justify-end p-4 shadow-lg">
        <button 
          onClick={handleLogout} 
          className="py-2 px-4 bg-blood-red hover:bg-dark-red text-white font-bold rounded"
        >
          Logout
        </button>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
