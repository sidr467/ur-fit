const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {
    createChallenge,
    getChallenges,
    getChallengeById,
    joinChallenge,
    getUserJoinedChallenges
} = require('../controllers/challengeController');

// Create a new challenge
router.post('/', createChallenge);          

// Get all challenges
router.get('/', getChallenges);         

// Get a challenge by ID
router.get('/:id', getChallengeById);

router.post('/:id/join', auth, joinChallenge); 
router.get('/joined/me', auth, getUserJoinedChallenges);                                                                                                 

module.exports = router;