import React from "react"
import { Link, useLocation } from "react-router-dom"
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material"

const Navbar = ({ user, onLogout }) => {
  const location = useLocation()

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #000", // Add black bottom border
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          UR Fit
        </Typography>
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography>Home</Typography>
          </Link>
          <Link
            to="/challenges"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography>Challenges</Typography>
          </Link>
          {user ? (
            <Button
              onClick={onLogout}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#333",
                  color: "#fff",
                },
              }}
            >
              Logout
            </Button>
          ) : location.pathname === "/signup" ? (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#333",
                  color: "#fff",
                },
              }}
            >
              Sign In
            </Button>
          ) : location.pathname === "/login" ? (
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#333",
                  color: "#fff",
                },
              }}
            >
              Sign Up
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#333",
                    color: "#fff",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#333",
                    color: "#fff",
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
