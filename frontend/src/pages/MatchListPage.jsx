import React, { useState, useEffect } from 'react';
import { getMatches, createMatch } from '../services/api';

const MatchListPage = () => {
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMatches = async () => {
      const data = await getMatches(token);
      setMatches(data);
    };
    fetchMatches();
  }, [token]);

  const handleCreateMatch = async () => {
    await createMatch(token);
    const data = await getMatches(token);
    setMatches(data);
  };

  return (
    <div>
      <h1>Matches</h1>
      <button onClick={handleCreateMatch}>Create Match</button>
      <ul>
        {matches.map(match => (
          <li key={match._id}>
            {match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchListPage;
