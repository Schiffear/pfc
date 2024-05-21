const API_URL = 'http://fauques.freeboxos.fr:3000';

const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
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

  return response.json().catch(() => ({ message: 'Accepted' })); // Handle non-JSON responses
};

export const register = (data) => request('/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => request('/login', { method: 'POST', body: JSON.stringify(data) });
export const getMatches = () => request('/matches');
export const createMatch = () => request('/matches', { method: 'POST' });
export const getMatchById = (id) => request(`/matches/${id}`);
export const addTurn = (id, idTurn, data) => request(`/matches/${id}/turns/${idTurn}`, { method: 'POST', body: JSON.stringify(data) });
export const subscribeToMatch = (id, onMessage) => {
  const token = localStorage.getItem('token');
  const eventSource = new EventSource(`${API_URL}/matches/${id}/subscribe?token=${token}`);

  eventSource.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  return () => eventSource.close();
};
