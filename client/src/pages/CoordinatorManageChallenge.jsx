import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  Box,
  Typography,
  Container,
  Divider,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  Chip,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  getChallengeById,
  updateSingleChallengeLink,
  updateSingleChallengePdf,
  addChallengeLink,
  addChallengePdf,
  deleteSingleChallengeLink,
  deleteSingleChallengePdf,
  editChallenge,
  deleteChallenge,
} from "../services/api"
import EditableList from "../components/EditableList"
import Navbar from "../components/Navbar"

const CoordinatorManageChallenge = () => {
  const { id } = useParams()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  let user = null
  const [editMode, setEditMode] = useState(false)
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    longDescription: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  try {
    if (token) user = jwtDecode(token)
  } catch {
    user = null
  }

  useEffect(() => {
    if (challenge) {
      setEditFields({
        title: challenge.title || "",
        description: challenge.description || "",
        longDescription: challenge.longDescription || "",
      })
    }
  }, [challenge])

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const decoded = jwtDecode(token)
      if (decoded.role !== "coordinator") {
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
            {editMode ? (
              <>
                <TextField
                  label="Title"
                  value={editFields.title}
                  onChange={(e) =>
                    setEditFields({ ...editFields, title: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  value={editFields.description}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Long Description"
                  value={editFields.longDescription}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      longDescription: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{ mr: 2, backgroundColor: "#000" }}
                  onClick={async () => {
                    try {
                      await editChallenge(challenge._id, editFields, token)
                      setEditMode(false)
                      const updated = await getChallengeById(
                        challenge._id,
                        token
                      )
                      setChallenge(updated)
                    } catch (err) {
                      // Handle error (show Snackbar, etc.)
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {challenge.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
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
                <Divider />
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  color="black"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    mt: 2,
                    ml: 2,
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                  }}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>
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
            <EditableList
              items={challenge.externalLink || []}
              onUpdate={async (idx, value) => {
                await updateSingleChallengeLink(id, idx, value, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              onAdd={async (value) => {
                await addChallengeLink(id, value, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              onDelete={async (idx) => {
                await deleteSingleChallengeLink(id, idx, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              label=""
              type="link"
            />
          </Box>
          {/* Bottom Right: PDFs */}
          <Box gridArea="pdfs">
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              PDF Resources
            </Typography>
            <EditableList
              items={challenge.pdfs || []}
              onUpdate={async (idx, value) => {
                await updateSingleChallengePdf(id, idx, value, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              onAdd={async (value) => {
                await addChallengePdf(id, value, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              onDelete={async (idx) => {
                await deleteSingleChallengePdf(id, idx, token)
                const updated = await getChallengeById(id)
                setChallenge(updated)
              }}
              label=""
              type="pdf"
            />
          </Box>
        </Box>
      </Container>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Challenge</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this challenge? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="black">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await deleteChallenge(challenge._id, token)
                setDeleteDialogOpen(false)
                navigate("/coordinator-challenges")
              } catch (err) {
                setDeleteDialogOpen(false)
                alert(
                  err.response?.data?.message || "Failed to delete challenge"
                )
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CoordinatorManageChallenge
