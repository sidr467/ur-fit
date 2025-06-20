/**
 * User.js
 * -------
 * Mongoose model for users in the UR Fit backend.
 */

const mongoose = require("mongoose")

// Define the schema for a user
const UserSchema = new mongoose.Schema(
  {
    // User's name (required)
    name: { type: String, required: true },
    // User's email (required, unique)
    email: { type: String, required: true, unique: true },
    // Hashed password (required)
    password: { type: String, required: true },
    // User role: participant or coordinator (required)
    role: {
      type: String,
      enum: ["participant", "coordinator"],
      required: true,
    },
    // Array of joined challenge IDs (references Challenge model)
    joinedChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
)

module.exports = mongoose.model("User", UserSchema)
