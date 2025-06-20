/**
 * userRoutes.js
 * -------------
 * Defines user-related routes for the UR Fit backend.
 */

const express = require("express")
const router = express.Router()
const { getAllUsers } = require("../controllers/authController")

// GET / : Return all users (for coordinators)
router.get("/", getAllUsers)

module.exports = router
