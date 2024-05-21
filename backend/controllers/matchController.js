const Match = require('../models/Match');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

let matchSubscriptions = {};

const authenticateTokenForSSE = (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().populate('user1').populate('user2');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('user1').populate('user2');
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    let match = await Match.findOne({ user1: userId, user2: null });
    if (!match) {
      match = new Match({ user1: userId });
      await match.save();
      res.status(201).json(match);
    } else {
      res.status(400).json({ message: 'You already have a match' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const match = await Match.findOneAndDelete({ user1: userId, user2: null });
    if (match) {
      res.status(200).json({ message: 'Match deleted' });
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    let match = await Match.findOne({ _id: req.params.id, user2: null });
    if (match) {
      match.user2 = userId;
      await match.save();

      if (matchSubscriptions[match._id]) {
        matchSubscriptions[match._id].forEach(callback => callback({
          type: 'PLAYER_JOIN',
          matchId: match._id,
          payload: { user: userId }
        }));
      }

      res.status(200).json(match);
    } else {
      res.status(400).json({ message: 'Cannot join match' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTurn = async (req, res) => {
  try {
    const { move } = req.body;
    const match = await Match.findById(req.params.id);
    if (match) {
      const userId = req.user.userId;
      const turnId = req.params.idTurn;
      match.turns.push({ move, user: userId });
      await match.save();

      if (matchSubscriptions[match._id]) {
        matchSubscriptions[match._id].forEach(callback => callback({
          type: 'NEW_TURN',
          matchId: match._id,
          payload: { turnId: match.turns.length }
        }));

        if (match.turns.length % 2 === 0) {
          // Both players have made their moves
          const lastTwoTurns = match.turns.slice(-2);
          const winner = determineWinner(lastTwoTurns);

          matchSubscriptions[match._id].forEach(callback => callback({
            type: 'TURN_ENDED',
            matchId: match._id,
            payload: { newTurnId: match.turns.length / 2 + 1, winner }
          }));

          if (winner === 'draw' || match.turns.length === 6) {
            // The match ended
            matchSubscriptions[match._id].forEach(callback => callback({
              type: 'MATCH_ENDED',
              matchId: match._id,
              payload: { winner }
            }));
          }
        }
      }

      res.status(202).json({ turn: 'not last' });
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const determineWinner = (turns) => {
  const [turn1, turn2] = turns;
  const move1 = turn1.move;
  const move2 = turn2.move;
  if (move1 === move2) return 'draw';
  if (
    (move1 === 'rock' && move2 === 'scissors') ||
    (move1 === 'scissors' && move2 === 'paper') ||
    (move1 === 'paper' && move2 === 'rock')
  ) {
    return turn1.user;
  }
  return turn2.user;
};

const subscribeToMatch = [authenticateTokenForSSE, (req, res) => {
  const matchId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  if (!matchSubscriptions[matchId]) {
    matchSubscriptions[matchId] = [];
  }

  matchSubscriptions[matchId].push(sendEvent);

  req.on('close', () => {
    matchSubscriptions[matchId] = matchSubscriptions[matchId].filter(cb => cb !== sendEvent);
  });
}];

module.exports = { getMatches, getMatchById, createMatch, deleteMatch, joinMatch, addTurn, subscribeToMatch };
