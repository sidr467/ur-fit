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

router.post("/:id/link", addChallengeLink)
router.put("/:id/links", updateSingleChallengeLink)

router.put("/:id/pdf", updateSingleChallengePdf)
router.post("/:id/pdf", addChallengePdf)

module.exports = router
