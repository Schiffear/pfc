import jwtDecode from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token has expired");
      return false;
    }

    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log("Stored token:", token);
  if (isTokenValid(token)) {
    return token;
  } else {
    localStorage.removeItem('token');
    return null;
  }
};
