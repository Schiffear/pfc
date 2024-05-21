import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, addTurn, subscribeToMatch } from '../services/api';

const FightPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');
  const [myTurn, setMyTurn] = useState(false); // Initialize as false
  const [moveMade, setMoveMade] = useState(false); // Track if the player has made a move
  const navigate = useNavigate();

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
          console.log('Turn ended:', event.payload.turnId, 'Winner:', event.payload.winner);
          fetchMatch();
          break;
        case 'PLAYER_MOVED':
          console.log('Player moved:', event.payload.turn);
          fetchMatch();
          break;
        case 'MATCH_ENDED':
          console.log('Match ended. Winner:', event.payload.winner);
          navigate('/matches');
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  useEffect(() => {
    if (match) {
      const userId = localStorage.getItem('userId');
      const turnNumber = Math.floor(match.turns.length / 2) + 1;
      const isUserTurn = (match.turns.length % 2 === 0 && match.user1._id === userId) ||
                          (match.turns.length % 2 === 1 && match.user2 && match.user2._id === userId);
      setMyTurn(isUserTurn);
      setMoveMade(false); // Reset move made when a new turn starts
    }
  }, [match]);

  const handleMove = async (move) => {
    if (moveMade) {
      setError('You have already made a move for this turn.');
      return;
    }
    try {
      await addTurn(id, Math.floor(match.turns.length / 2) + 1, { move });
      setMoveMade(true);
    } catch (error) {
      console.error('Error adding turn:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Match {id}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {match && match.user1 && (
        <div>
          <p>{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
          {myTurn ? (
            <div>
              <button onClick={() => handleMove('rock')}>Rock</button>
              <button onClick={() => handleMove('paper')}>Paper</button>
              <button onClick={() => handleMove('scissors')}>Scissors</button>
            </div>
          ) : (
            <p>Waiting for opponent to make a move...</p>
          )}
          <div>
            <h2>Turns:</h2>
            <ul>
              {match.turns.map((turn, index) => (
                <li key={index}>{turn.user ? turn.user.username : 'Unknown'}: {turn.move}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate('/matches')}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default FightPage;
