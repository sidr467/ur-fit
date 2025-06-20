/**
 * authController.js
 * -----------------
 * Controller functions for authentication and user management in the UR Fit backend.
 */
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register a new user
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" })

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Create and save the new user
    const user = new User({ name, email, password: hashedPassword, role })

    await user.save()
    res.status(201).json({ message: "Signup successful" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// Authenticate user and return JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )

    // Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// Get all users with role "participant" (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "participant" }, "-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}