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
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-unifraktur mb-6 text-center">Match {id}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {match && (
        <div className="w-full max-w-2xl">
          <p className="text-center mb-4">{match.user1.username} vs {match.user2 ? match.user2.username : 'Waiting for opponent'}</p>
          <div className="flex justify-around mb-8">
            <div 
              className="w-24 h-32 bg-cover bg-center cursor-pointer rounded-lg shadow-lg" 
              style={{ backgroundImage: "url('https://lantredecthulhu.com/wp-content/uploads/2016/04/article-qui-est-cthulhu.jpg')" }}
              onClick={() => handleMove('rock')}
            >
              <p className="text-center mt-24 font-bold">Rock</p>
            </div>
            <div 
              className="w-24 h-32 bg-cover bg-center cursor-pointer rounded-lg shadow-lg" 
              style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/05/58/54/53/360_F_558545357_OZwyZYPL5i9oiadw9JspOvhOj13OrK7a.jpg')" }}
              onClick={() => handleMove('paper')}
            >
              <p className="text-center mt-24 font-bold">Paper</p>
            </div>
            <div 
              className="w-24 h-32 bg-cover bg-center cursor-pointer rounded-lg shadow-lg" 
              style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/05/63/75/53/360_F_563755388_GqRQFKJsFuRCgYb2T5VeZridLj8ZIaZf.jpg')" }}
              onClick={() => handleMove('scissors')}
            >
              <p className="text-center mt-24 font-bold">Scissors</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-unifraktur mb-4">Turns:</h2>
            <ul className="space-y-2">
              {match.turns.map((turn, index) => (
                <li key={index} className="p-2 bg-gray-800 text-white border border-blood-red rounded">
                  {turn.user.username}: {turn.move}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightPage;