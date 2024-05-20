const express = require('express');
const { getMatches, getMatchById, createMatch, addTurn } = require('../controllers/matchController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define routes without prefix
router.get('/matches', authenticateToken, getMatches);
router.get('/matches/:id', authenticateToken, getMatchById);
router.post('/matches', authenticateToken, createMatch);
router.post('/matches/:id/turns/:idTurn', authenticateToken, addTurn);

module.exports = router;
