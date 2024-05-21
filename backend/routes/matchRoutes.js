const express = require('express');
const { getMatches, getMatchById, createMatch, joinMatch, addTurn, subscribeToMatch } = require('../controllers/matchController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/matches', authenticateToken, getMatches);
router.get('/matches/:id', authenticateToken, getMatchById);
router.post('/matches', authenticateToken, createMatch);
router.post('/matches/:id/join', authenticateToken, joinMatch);
router.post('/matches/:id/turns/:idTurn', authenticateToken, addTurn);
router.get('/matches/:id/subscribe', authenticateToken, subscribeToMatch);

module.exports = router;
