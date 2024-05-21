import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
