const express = require('express');
const { authenticateTokenForSSE } = require('../middleware/authToken');
const { getMatches, getMatchById, createMatch, deleteMatch, joinMatch, addTurn, subscribeToMatch, subscribeToMatches } = require('../controllers/matchController');

const router = express.Router();

router.get('/matches', authenticateTokenForSSE, getMatches);
router.get('/matches/:id', authenticateTokenForSSE, getMatchById);
router.post('/matches', authenticateTokenForSSE, createMatch);
router.delete('/matches/:id', authenticateTokenForSSE, deleteMatch);
router.post('/matches/:id/join', authenticateTokenForSSE, joinMatch);
router.post('/matches/:id/turns/:idTurn', authenticateTokenForSSE, addTurn);
router.get('/matches/:id/subscribe', authenticateTokenForSSE, subscribeToMatch);
router.get('/matches/subscribe', authenticateTokenForSSE, subscribeToMatches);

module.exports = router;
