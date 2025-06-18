const express = require("express")
const auth = require("../middleware/auth")
const router = express.Router()
const {
  createChallenge,
  getChallenges,
  getChallengeById,
  joinChallenge,
  getUserJoinedChallenges,
  userEnrollment,
  addChallengeLink,
  updateSingleChallengeLink,
  updateSingleChallengePdf,
  addChallengePdf,
  deleteSingleChallengeLink,
  deleteSingleChallengePdf
} = require("../controllers/challengeController")

// Create a new challenge
router.post("/", createChallenge)

// Get all challenges
router.get("/", getChallenges)

// Get a challenge by ID
router.get("/:id", getChallengeById)

router.post("/:id/join", auth, joinChallenge)
router.get("/joined/me", auth, getUserJoinedChallenges)
router.post("/enroll", auth, userEnrollment)

router.post("/:id/link", auth, addChallengeLink)
router.put("/:id/links", auth, updateSingleChallengeLink)

router.put("/:id/pdf", auth, updateSingleChallengePdf)
router.post("/:id/pdf", auth, addChallengePdf)

router.delete('/:id/link', auth, deleteSingleChallengeLink);
router.delete('/:id/pdf', auth, deleteSingleChallengePdf);

module.exports = router
