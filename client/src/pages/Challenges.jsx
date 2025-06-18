import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import { CircularProgress, Container, Tabs, Tab } from "@mui/material"
import Navbar from "../components/Navbar"
import {
  getAllChallenges,
  getJoinedChallenges,
  joinChallenge,
} from "../services/api"
import ChallengeCard from "../components/ChallengeCard"
import ExpandedChallengeCard from "../components/ExpandedChallengeCard"

const Challenges = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [allChallenges, setAllChallenges] = useState([])
  const [joinedChallenges, setJoinedChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [useExpandedView, setUseExpandedView] = useState(false)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState(() => {
    const savedTab = localStorage.getItem("challengesTab")
    return savedTab !== null ? Number(savedTab) : 0
  })
  // Get user from the token
  let user = null
  try {
    if (token) user = jwtDecode(token)
  } catch {
    user = null
  }

  // Fetch data functions
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

  const filteredAllChallenges = allChallenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(search.toLowerCase()) ||
      (challenge.description &&
        challenge.description.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredJoinedChallenges = joinedChallenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(search.toLowerCase()) ||
      (challenge.description &&
        challenge.description.toLowerCase().includes(search.toLowerCase()))
  )

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

  const handleJoin = async (challengeId) => {
    await joinChallenge(challengeId, token)
    fetchAll()
    fetchJoined()
  }

  const handleTabChange = (_, v) => {
    setTab(v)
    localStorage.setItem("challengesTab", v) // Save tab index
  }

  const isJoined = (challengeId) =>
    joinedChallenges.some((c) => c._id === challengeId)

  if (!user) return null

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem("token")
          navigate("/login")
        }}
      />

      <Container maxWidth="lg" style={{ padding: "32px 0" }}>
        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Wellness Challenges
        </h1>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>
          Welcome to UR Fit, {user?.name || "User"}!
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "300px",
              marginRight: "16px",
            }}
          />

          <button
            onClick={() => setUseExpandedView(!useExpandedView)}
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              height: "40px",
            }}
          >
            {useExpandedView ? "Card View" : "Detailed View"}
          </button>
        </div>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: "#000", height: 1.5 } }}
          sx={{
            marginBottom: "24px",
            minHeight: 0,
            "& .MuiTab-root": {
              minHeight: 0,
              fontSize: "16px",
              fontWeight: "normal",
              color: "#666",
            },
            "& .Mui-selected": {
              color: "#000 !important",
            },
          }}
        >
          <Tab
            label="All Challenges"
            style={{
              fontSize: "16px",
            }}
          />
          <Tab
            label="My Challenges"
            style={{
              fontSize: "16px",
            }}
          />
        </Tabs>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "80px 0",
            }}
          >
            <CircularProgress size={60} />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: useExpandedView
                ? "1fr"
                : "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {tab === 0 ? (
              filteredAllChallenges.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "48px 0",
                  }}
                >
                  <p style={{ fontSize: "18px", color: "#666" }}>
                    No challenges available
                  </p>
                </div>
              ) : (
                filteredAllChallenges
                  .filter((challenge) => !isJoined(challenge._id))
                  .map((challenge) =>
                    useExpandedView ? (
                      <ExpandedChallengeCard
                        key={challenge._id}
                        challenge={challenge}
                        isJoined={isJoined(challenge._id)}
                        onJoin={handleJoin}
                      />
                    ) : (
                      <ChallengeCard
                        key={challenge._id}
                        challenge={challenge}
                        isJoined={isJoined(challenge._id)}
                        onJoin={handleJoin}
                      />
                    )
                  )
              )
            ) : filteredJoinedChallenges.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "48px 0",
                }}
              >
                <p style={{ fontSize: "18px", color: "#666" }}>
                  No joined challenges
                </p>
              </div>
            ) : (
              filteredJoinedChallenges.map((challenge) =>
                useExpandedView ? (
                  <ExpandedChallengeCard
                    key={challenge._id}
                    challenge={challenge}
                    isJoined={true}
                    onJoin={handleJoin}
                  />
                ) : (
                  <ChallengeCard
                    key={challenge._id}
                    challenge={challenge}
                    isJoined={true}
                    onJoin={handleJoin}
                  />
                )
              )
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Challenges
