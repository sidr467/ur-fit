import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import {
  getAllChallenges,
  getJoinedChallenges,
  joinChallenge,
} from "../services/api"

const Challenges = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  let user = null

  try {
    if (token) user = jwtDecode(token)
  } catch {
    user = null
  }

  const [tab, setTab] = useState(0)
  const [allChallenges, setAllChallenges] = useState([])
  const [joinedChallenges, setJoinedChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    const res = await getAllChallenges(token)
    setAllChallenges(res.data)
    setLoading(false)
  }

  const fetchJoined = async () => {
    setLoading(true)
    const res = await getJoinedChallenges(token)
    setJoinedChallenges(res.data)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if (user.role === "coordinator") {
      navigate("/coordinator-challenges")
      return
    }
    fetchAll()
    fetchJoined()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleJoin = async (challengeId) => {
    await joinChallenge(challengeId, token)
    fetchAll()
    fetchJoined()
  }

  const isJoined = (challengeId) =>
    joinedChallenges.some((c) => c._id === challengeId)

  if (!user) return null

  return (
    <Box p={3}>
      <Navbar user={user} onLogout={handleLogout} />
      <Typography>Welcome, {user.name}</Typography>
      {/* <Button onClick={handleLogout} variant="outlined" sx={{ mb: 3 }}>Logout</Button> */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="All Challenges" />
          <Tab label="Joined Challenges" />
        </Tabs>
      </Paper>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {tab === 0 && (
            <Box>
              {allChallenges.length === 0 ? (
                <Typography>No challenges found.</Typography>
              ) : (
                allChallenges
                  .filter((challenge) => !isJoined(challenge._id))
                  .map((challenge) => (
                    <Paper key={challenge._id} sx={{ p: 2, mb: 2 }}>
                      {challenge.imageUrl && (
                        <img
                          src={challenge.imageUrl}
                          alt={challenge.title}
                          style={{
                            width: 200,
                            height: 200,
                            objectFit: "cover",
                            marginBottom: 8,
                            borderRadius: 8,
                            display: "block",
                          }}
                        />
                      )}
                      <Typography variant="h6">{challenge.title}</Typography>
                      <Typography>{challenge.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Days: {challenge.totalDays} | Participants:{" "}
                        {challenge.participantCount}
                      </Typography>
                      {isJoined(challenge._id) ? (
                        <Button disabled sx={{ mt: 1 }}>
                          Joined
                        </Button>
                      ) : (
                        <Button
                          sx={{ mt: 1 }}
                          variant="contained"
                          onClick={() => handleJoin(challenge._id)}
                        >
                          Join
                        </Button>
                      )}
                    </Paper>
                  ))
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box>
              {joinedChallenges.length === 0 ? (
                <Typography>You haven't joined any challenges yet.</Typography>
              ) : (
                joinedChallenges.map((challenge) => (
                  <Paper key={challenge._id} sx={{ p: 2, mb: 2 }}>
                    {challenge.imageUrl && (
                      <img
                        src={challenge.imageUrl}
                        alt={challenge.title}
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: "cover",
                          marginBottom: 8,
                          borderRadius: 8,
                          display: "block",
                        }}
                      />
                    )}
                    <Typography variant="h6">{challenge.title}</Typography>
                    <Typography>{challenge.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Days: {challenge.totalDays} | Participants:{" "}
                      {challenge.participantCount}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Challenges
