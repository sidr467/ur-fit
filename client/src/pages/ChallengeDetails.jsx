import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  Box,
  Typography,
  Container,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material"
import { getChallengeById } from "../services/api"
import Navbar from "../components/Navbar"

const ChallengeDetails = () => {
  const { id } = useParams()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  let user = null

  try {
    if (token) user = jwtDecode(token)
  } catch {
    user = null
  }

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const decoded = jwtDecode(token)
      if (decoded.role !== "participant") {
        navigate("/login")
      }
    } catch {
      navigate("/login")
    }
  }, [token, navigate])

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true)
      try {
        const challenge = await getChallengeById(id)
        setChallenge(challenge)
      } catch (err) {
        setChallenge(null)
      }
      setLoading(false)
    }
    fetchChallenge()
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!challenge) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="error">
          Challenge not found.
        </Typography>
      </Box>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Navbar user={user} onLogout={handleLogout} />
      <Container sx={{ py: 6 }}>
        {/* Top: Image and Details */}
        <Box
          display="grid"
          gridTemplateAreas={`"image details"`}
          gridTemplateColumns="1fr 2fr"
          gap={4}
          alignItems="center"
        >
          <Box gridArea="image" display="flex" justifyContent="center">
            {challenge.imageUrl && (
              <img
                src={challenge.imageUrl}
                alt={challenge.title}
                style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8 }}
              />
            )}
          </Box>
          <Box gridArea="details">
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {challenge.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {challenge.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ mb: 2 }}>
              {challenge.longDescription}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={`${challenge.totalDays} Days`} sx={{ mr: 2 }} />
              <Chip label={`${challenge.participantCount} Participants`} />
            </Box>
          </Box>
        </Box>
        {/* Bottom: Links and PDFs side by side */}
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gridTemplateAreas={`"links pdfs"`}
          gap={4}
          mt={4}
        >
          <Box gridArea="links">
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              External Links
            </Typography>
            {challenge.externalLink && challenge.externalLink.length > 0 ? (
              challenge.externalLink.map((link, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      marginRight: 8,
                      color: "#1976d2",
                      textDecoration: "underline",
                      wordBreak: "break-all",
                    }}
                  >
                    {link}
                  </a>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No external links.
              </Typography>
            )}
          </Box>
          <Box gridArea="pdfs">
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              PDF Resources
            </Typography>
            {challenge.pdfs && challenge.pdfs.length > 0 ? (
              challenge.pdfs.map((pdf, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    href={pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#000",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#333" },
                      mb: 1,
                    }}
                  >
                    PDF {idx + 1}
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No PDF resources.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default ChallengeDetails
