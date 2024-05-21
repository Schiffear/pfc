import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById, addTurn, subscribeToMatch } from '../services/api';

const FightPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await getMatchById(id);
        setMatch(data);
      } catch (error) {
        console.error('Error fetching match:', error);
        setError(error.message);
      }
    };

    fetchMatch();

    const unsubscribe = subscribeToMatch(id, (event) => {
      switch (event.type) {
        case 'PLAYER_JOIN':
          console.log('Player joined:', event.payload.user);
          fetchMatch();
          break;
        case 'NEW_TURN':
          console.log('New turn:', event.payload.turnId);
          fetchMatch();
          break;
        case 'TURN_ENDED':
          console.log('Turn ended:', event.payload.newTurnId, 'Winner:', event.payload.winner);
          break;
        case 'PLAYER_MOVED':
          console.log('Player moved:', event.payload.turn);
          break;
        case 'MATCH_ENDED':
          console.log('Match ended. Winner:', event.payload.winner);
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleMove = async (move) => {
    try {
      await addTurn(id, match.turns.length + 1, { move });
    } catch (error) {
      console.error('Error adding turn:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Match {id}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {match && (
        <div>
          <p>{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
          <div>
            <button onClick={() => handleMove('rock')}>Rock</button>
            <button onClick={() => handleMove('paper')}>Paper</button>
            <button onClick={() => handleMove('scissors')}>Scissors</button>
          </div>
          <div>
            <h2>Turns:</h2>
            <ul>
              {match.turns.map((turn, index) => (
                <li key={index}>{turn.user.username}: {turn.move}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightPage;
