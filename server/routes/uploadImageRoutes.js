/**
 * uploadImageRoutes.js
 * --------------------
 * Defines the image upload route for the UR Fit backend using multer.
 */

const express = require("express")
const multer = require("multer")
const path = require("path")
const router = express.Router()

// Configure multer storage to save files in /public with a unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public"))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage: storage })

// POST / : Handle image upload
router.post("/", upload.single("image"), (req, res) => {
  // If no file is uploaded, return error
  if (!req.file) return res.status(400).json({ message: "No file uploaded" })
  // Build the image URL for the uploaded file
  const imageUrl = `/public/${req.file.filename}`
  res.json({ imageUrl })
})

module.exports = router
