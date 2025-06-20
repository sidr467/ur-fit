import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Box,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material"
import sideImage from "../../assets/Skipping.png"
import { signup as signupService } from "../../services/api"
import Navbar from "../Navbar"

/**
 * SignUpPage Component
 * --------------------
 * Renders the signup (registration) page for UR Fit.
 */

const SignUpPage = () => {
  // State for form fields, error, and success messages
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission and signup logic
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      const res = await signupService(formData)
      if (
        res.data &&
        res.data.message &&
        res.data.message.toLowerCase().includes("error")
      ) {
        setError(res.data.message || "Signup failed")
        return
      }
      setSuccess("Signup successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Server error")
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Navbar component for navigation and logout */}
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left side image*/}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box
            component="img"
            src={sideImage}
            alt="Wellness"
            sx={{
              maxWidth: "70%",
              maxHeight: "70%",
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Right side: signup form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: "400px",
              p: 4,
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
              Create Account
            </Typography>

            {/* Signup form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />

              {/* Role selection radio buttons */}
              <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup
                  row
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="participant"
                    control={<Radio />}
                    label="Participant"
                  />
                  <FormControlLabel
                    value="coordinator"
                    control={<Radio />}
                    label="Coordinator"
                  />
                </RadioGroup>
              </FormControl>

              {/* Show error or success messages */}
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" sx={{ mb: 2 }}>
                  {success}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  py: 1.5,
                  mb: 2,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Sign Up
              </Button>
            </form>

            {/* Link to login page */}
            <Typography align="center">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "black", fontWeight: "bold" }}>
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default SignUpPage
