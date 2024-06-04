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
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-2xl border border-dark-red">
        <h1 className="text-4xl font-unifraktur mb-6 text-center">Matches</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          onClick={handleCreateMatch} 
          className="w-full py-2 mb-4 bg-blood-red hover:bg-dark-red text-white font-bold rounded"
        >
          Create Match
        </button>
        <div className="space-y-4">
          {matches.map(match => (
            <div
              key={match._id}
              onClick={() => handleNavigateToMatch(match._id)}
              className="p-4 bg-gray-800 text-white border border-blood-red rounded cursor-pointer hover:bg-gray-700"
            >
              <p>{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchListPage;
