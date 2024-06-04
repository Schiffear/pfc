import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login({ username, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      const user = jwtDecode(data.token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/matches');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white" style={{ 
      backgroundImage: `url('https://lantredecthulhu.com/wp-content/uploads/2016/04/article-qui-est-cthulhu.jpg'), url('https://t4.ftcdn.net/jpg/05/58/54/53/360_F_558545357_OZwyZYPL5i9oiadw9JspOvhOj13OrK7a.jpg'), url('https://t4.ftcdn.net/jpg/05/63/75/53/360_F_563755388_GqRQFKJsFuRCgYb2T5VeZridLj8ZIaZf.jpg')`, 
      backgroundSize: '33% 50%, 33% 50%, 33% 50%', 
      backgroundPosition: 'left, center top, right', 
      backgroundRepeat: 'no-repeat',
      boxShadow: '0px 0px 100px rgba(0, 0, 255, 0.5), 0px 0px 10px rgba(255, 0, 0, 0.5), 0px 0px 10px rgba(255, 255, 0, 0.5)' // Auras différentes pour chaque image
    }}>
      <div className="max-w-md w-full p-8 rounded-lg shadow-2xl border border-dark-red bg-gray-900 bg-opacity-75" style={{ marginTop: '450px' }}>
        <h1 className="text-4xl font-unifraktur mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
            className="w-full p-2 mb-4 bg-gray-800 text-white border border-blood-red rounded"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            className="w-full p-2 mb-4 bg-gray-800 text-white border border-blood-red rounded"
          />
          <button type="submit" className="w-full py-2 bg-blood-red hover:bg-dark-red text-white font-bold rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;