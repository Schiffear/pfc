const API_URL = 'http://fauques.freeboxos.fr:3000';

const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};

export const register = (data) => request('/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => request('/login', { method: 'POST', body: JSON.stringify(data) });
export const getMatches = () => request('/matches');
export const createMatch = () => request('/matches', { method: 'POST' });
export const getMatchById = (id) => request(`/matches/${id}`);
export const addTurn = (id, idTurn, data) => request(`/matches/${id}/turns/${idTurn}`, {
  method: 'POST',
  body: JSON.stringify(data)
});
