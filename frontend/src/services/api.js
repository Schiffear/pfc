import { getToken } from '../utils/auth';

const API_URL = 'http://fauques.freeboxos.fr:3000';

const request = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json().catch(() => ({ message: 'Accepted' }));
};

export const register = (data) => request('/register', { method: 'POST', body: JSON.stringify(data) });
export const login = async (data) => {
  const response = await request('/login', { method: 'POST', body: JSON.stringify(data) });
  localStorage.setItem('token', response.token);
  return response;
};
export const getMatches = () => request('/matches', { method: 'GET' });
export const createMatch = () => request('/matches', { method: 'POST' });
export const getMatchById = (id) => request(`/matches/${id}`, { method: 'GET' });
export const addTurn = (id, idTurn, data) => request(`/matches/${id}/turns/${idTurn}`, { method: 'POST', body: JSON.stringify(data) });

export const subscribeToMatch = (id, onMessage) => {
  const token = getToken();
  const eventSource = new EventSource(`${API_URL}/matches/${id}/subscribe`);

  eventSource.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();
  };

  return () => eventSource.close();
};

export const subscribeToMatches = (onMessage) => {
  const token = getToken();
  const eventSource = new EventSource(`${API_URL}/matches/subscribe?token=${encodeURIComponent(token)}`);

  eventSource.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();
  };

  return () => eventSource.close();
};
