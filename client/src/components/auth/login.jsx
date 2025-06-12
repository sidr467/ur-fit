import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography, Paper } from "@mui/material"
import sideImage from "../../assets/Skipping.png"
import { login as loginService } from "../../services/api"
import Navbar from "../Navbar"
import { jwtDecode } from "jwt-decode"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await loginService(formData)
      if (!res.data.token) {
        setError(res.data.message || "Login failed")
        return
      }
      localStorage.setItem("token", res.data.token)
      const user = jwtDecode(res.data.token)
      if (user.role === "coordinator") {
        navigate("/coordinator-challenges")
      } else {
        navigate("/challenges")
      }
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
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
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

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "f5f5f5",
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
              Sign in
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
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
              />

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
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
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: "4px",
                  "&:hover": { backgroundColor: "#333", color: "#fff" },
                }}
              >
                Sign in
              </Button>
            </form>

            <Typography align="center">
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "black", fontWeight: "bold" }}>
                Sign up
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage