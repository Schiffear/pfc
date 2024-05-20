const Match = require('../models/Match');

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

const addTurn = async (req, res) => {
  try {
    const { move } = req.body;
    const match = await Match.findById(req.params.id);
    if (match) {
      const userId = req.user.userId;
      match.turns.push({ move, user: userId });
      await match.save();
      res.status(202).json({ message: 'Turn added' });
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMatches, getMatchById, createMatch, addTurn };
