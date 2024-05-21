import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Debug log
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token has expired");
      return false; // Token has expired
    }

    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log("Stored token:", token); // Debug log
  if (isTokenValid(token)) {
    return token;
  } else {
    localStorage.removeItem('token');
    return null;
  }
};
