import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, createMatch } from '../services/api';

const MatchListPage = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError(error.message);
      }
    };

    fetchMatches();

    const interval = setInterval(fetchMatches, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateMatch = async () => {
    try {
      await createMatch();
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error creating match:', error);
      setError(error.message);
    }
  };

  const handleNavigateToMatch = (id) => {
    navigate(`/matches/${id}`);
  };

  return (
    <div>
      <h1>Matches</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleCreateMatch}>Create Match</button>
      <div>
        {matches.map(match => (
          <div
            key={match._id}
            onClick={() => handleNavigateToMatch(match._id)}
            style={{ border: '1px solid black', padding: '10px', margin: '10px', cursor: 'pointer' }}
          >
            <p>{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchListPage;
