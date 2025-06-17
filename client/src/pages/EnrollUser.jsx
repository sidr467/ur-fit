import React, { useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom"
import {
  getAllUsers,
  getAllChallenges,
  userEnrollment,
  getChallengeById,
} from "../services/api"

const EnrollUser = () => {
  const [users, setUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const [enrolledUserIds, setEnrolledUserIds] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

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
      alert("Please select a challenge first.")
      return
    }
    userEnrollment({ userId, challengeId: selectedChallenge }, token)
      .then((res) => {
        alert(res.data.message || "Enrolled!")
        return getChallengeById(selectedChallenge, token)
      })
      .then((res) => {
        const ids = Array.isArray(res.data.participants)
          ? res.data.participants.map((u) =>
              typeof u === "string" ? u : u._id
            )
          : []
        setEnrolledUserIds(ids)
      })
      .catch((err) =>
        alert(
          err.response?.data?.message ||
            "Enrollment failed. User may already be enrolled."
        )
      )
  }

  return (
    <div>
      <h2>User List</h2>
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
          {users.map((user) => {
            console.log(
              "user._id:",
              user._id,
              "enrolledUserIds:",
              enrolledUserIds
            )
            return (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {enrolledUserIds.includes(user._id) ? (
                    <span>Enrolled</span>
                  ) : (
                    <button onClick={() => handleEnroll(user._id)}>
                      Enroll
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EnrollUser
