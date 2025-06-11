const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const path = require("path")

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/public", express.static(path.join(__dirname, "public")))

// Routes
app.use("/api/auth", require("./routes/authRoutes"))

const challengeRoutes = require("./routes/challengeRoutes")
app.use("/api/challenges", challengeRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
