import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import {
  getAllUsers,
  getAllChallenges,
  userEnrollment,
  getChallengeById,
} from "../services/api"
import Navbar from "../components/Navbar"

const EnrollUser = () => {
  const [users, setUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const [enrolledUserIds, setEnrolledUserIds] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const token = localStorage.getItem("token")
  let user = null

  try {
    if (token) user = jwtDecode(token)
  } catch {
    user = null
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const decoded = jwtDecode(token)
      if (decoded.role !== "coordinator") {
        navigate("/login")
        return
      }
    } catch {
      navigate("/login")
      return
    }
  }, [token, navigate])

  useEffect(() => {
    getAllUsers(token)
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
    getAllChallenges(token)
      .then((res) => setChallenges(res.data))
      .catch(() => setChallenges([]))
  }, [token])

  useEffect(() => {
    if (selectedChallenge) {
      getChallengeById(selectedChallenge, token)
        .then((challenge) => {
          const ids = Array.isArray(challenge.participants)
            ? challenge.participants.map((u) =>
                typeof u === "string" ? u : String(u._id)
              )
            : []
          setEnrolledUserIds(ids)
        })
        .catch(() => setEnrolledUserIds([]))
    } else {
      setEnrolledUserIds([])
    }
  }, [selectedChallenge, token])

  const handleEnroll = (userId) => {
    if (!selectedChallenge) {
      setSnackbar({
        open: true,
        message: "Please select a challenge first.",
        severity: "error",
      })
      return
    }
    userEnrollment({ userId, challengeId: selectedChallenge }, token)
      .then((res) => {
        setSnackbar({
          open: true,
          message: res.data.message || "Enrolled!",
          severity: "success",
        })
        return getChallengeById(selectedChallenge, token)
      })
      .then((challenge) => {
        const ids = Array.isArray(challenge.participants)
          ? challenge.participants.map((u) =>
              typeof u === "string" ? u : String(u._id)
            )
          : []
        setEnrolledUserIds(ids)
      })
      .catch((err) =>
        setSnackbar({
          open: true,
          message:
            err.response?.data?.message ||
            "Enrollment failed. User may already be enrolled.",
          severity: "error",
        })
      )
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "300px",
          marginBottom: "16px",
        }}
      />
      <div>
        <label>
          Select Challenge:{" "}
          <select
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
          >
            <option value="">--Select--</option>
            {challenges.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table border="1" cellPadding="8" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {enrolledUserIds.includes(String(user._id)) ? (
                  <span>Enrolled</span>
                ) : (
                  <button onClick={() => handleEnroll(user._id)}>Enroll</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  )
}

export default EnrollUser
