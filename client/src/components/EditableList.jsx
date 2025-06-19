import React, { useState } from "react"
import { Button, TextField, Box, Typography, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

const EditableList = ({
  items,
  onUpdate,
  onAdd,
  onDelete,
  label = "Item",
  type = "link",
}) => {
  const [editValues, setEditValues] = useState(items || [])
  const [newValue, setNewValue] = useState("")

  React.useEffect(() => {
    setEditValues(items || [])
  }, [items])

  const handleEdit = (idx, value) => {
    setEditValues((prev) => {
      const updated = [...prev]
      updated[idx] = value
      return updated
    })
  }

  const handleBlur = (idx, value) => {
    if (value !== items[idx]) {
      onUpdate(idx, value)
    }
  }

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim())
      setNewValue("")
    }
  }

  const handleDelete = (idx) => {
    if (onDelete) {
      onDelete(idx)
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {label}
      </Typography>
      {editValues.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" mb={1}>
          <TextField
            value={item}
            size="small"
            onChange={(e) => handleEdit(idx, e.target.value)}
            onBlur={() => handleBlur(idx, editValues[idx])}
            sx={{ mr: 1, flex: 1 }}
          />
          <IconButton
            size="small"
            onClick={() => handleDelete(idx)}
            sx={{
              ml: 1,
              color: "#ff3232", 
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box display="flex" alignItems="center">
        <TextField
          value={newValue}
          size="small"
          placeholder={`Add new ${type}`}
          onChange={(e) => setNewValue(e.target.value)}
          sx={{ mr: 1, flex: 1 }}
        />
        <Button
          variant="contained"
          color="black"
          size="small"
          onClick={handleAdd}
          sx={{
            minWidth: 0,
            px: 1,
            py: 0.5,
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#222",
              color: "#fff",
            },
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  )
}

export default EditableList
