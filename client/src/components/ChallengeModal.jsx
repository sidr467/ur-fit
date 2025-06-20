import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

/**
 * ChallengeModal Component
 * ------------------------
 * Renders a modal dialog for creating a new challenge.
 */

const ChallengeModal = ({ open, onClose, onCreate }) => {
  // State for form fields, error message, and image file
  const [form, setForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    totalDays: "",
    imageUrl: "",
    externalLink: "",
    pdfs: "",
  })
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  // Handle form submission
  const handleSubmit = async () => {
    setError("")
    let imageUrl = form.imageUrl

    // Upload image if a file is selected
    if (imageFile) {
      const data = new FormData()
      data.append("image", imageFile)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      })
      const result = await res.json()
      imageUrl = result.imageUrl
    }

    // Validate required fields
    if (!form.title || !form.description || !form.totalDays) {
      setError("Title, Description, and Total Days are required.")
      return
    }

    // Call onCreate with the new challenge data
    onCreate({
      ...form,
      imageUrl,
      totalDays: Number(form.totalDays),
      externalLink: form.externalLink
        ? form.externalLink.split(",").map((l) => l.trim())
        : [],
      pdfs: form.pdfs ? form.pdfs.split(",").map((l) => l.trim()) : [],
    })

    // Reset form and image file
    setForm({
      title: "",
      description: "",
      longDescription: "",
      totalDays: "",
      imageUrl: "",
      externalLink: "",
      pdfs: "",
    })
    setImageFile(null)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create New Challenge
        {/* Close button in the top-right corner */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Title input */}
        <TextField
          margin="normal"
          label="Title"
          name="title"
          fullWidth
          value={form.title}
          onChange={handleChange}
          required
        />
        {/* Short Description input */}
        <TextField
          margin="normal"
          label="Short Description"
          name="description"
          fullWidth
          value={form.description}
          onChange={handleChange}
          required
        />
        {/* Long Description input */}
        <TextField
          margin="normal"
          label="Long Description"
          name="longDescription"
          fullWidth
          multiline
          minRows={3}
          value={form.longDescription}
          onChange={handleChange}
        />
        {/* Total Days input */}
        <TextField
          margin="normal"
          label="Total Days"
          name="totalDays"
          type="number"
          fullWidth
          value={form.totalDays}
          onChange={handleChange}
          required
        />
        {/* Image upload input */}
        <TextField
          margin="normal"
          label="Upload Image"
          name="image"
          type="file"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: "image/*" }}
          onChange={handleFileChange}
        />
        {/* External Links input */}
        <TextField
          margin="normal"
          label="External Links (comma separated)"
          name="externalLink"
          fullWidth
          value={form.externalLink}
          onChange={handleChange}
          placeholder="https://youtube.com/..., https://resource.com/..."
        />
        {/* PDF Links input */}
        <TextField
          margin="normal"
          label="PDF Links (comma separated)"
          name="pdfs"
          fullWidth
          value={form.pdfs}
          onChange={handleChange}
          placeholder="https://example.com/file.pdf"
        />
        {/* Error message */}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {/* Cancel and Create buttons */}
        <Button onClick={onClose} color="black" variant="outlined">
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleSubmit}
          color="black"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChallengeModal
