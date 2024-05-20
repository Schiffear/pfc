import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById, addTurn } from '../services/api';

const MatchPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMatch = async () => {
      const data = await getMatchById(id, token);
      setMatch(data);
    };
    fetchMatch();
  }, [id, token]);

  const handleMove = async (move) => {
    const turnId = match.turns.length + 1;
    await addTurn(id, turnId, { move }, token);
    const data = await getMatchById(id, token);
    setMatch(data);
  };

  return (
    <div>
      <h1>Match</h1>
      {match && (
        <div>
          <p>{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
          <div>
            <button onClick={() => handleMove('rock')}>Rock</button>
            <button onClick={() => handleMove('paper')}>Paper</button>
            <button onClick={() => handleMove('scissors')}>Scissors</button>
          </div>
          <ul>
            {match.turns.map((turn, index) => (
              <li key={index}>{turn.user.username} chose {turn.move}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchPage;
