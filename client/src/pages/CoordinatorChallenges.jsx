import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllChallenges, createChallenge } from "../services/api";
import ChallengeModal from "../components/ChallengeModal";

const CoordinatorChallenges = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;

  try {
    if (token) user = jwtDecode(token);
  } catch {
    user = null;
  }

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "coordinator") {
      navigate("/challenges");
      return;
    }
    fetchChallenges();
    // eslint-disable-next-line
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const res = await getAllChallenges(token);
    setChallenges(res.data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateChallenge = async (challengeData) => {
    try {
      await createChallenge(challengeData, token);
      setModalOpen(false);
      fetchChallenges();
    } catch {
      // Optionally handle error
    }
  };

  if (!user || user.role !== "coordinator") return null;

  return (
    <Box p={3}>
      <Navbar user={user} onLogout={handleLogout} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Coordinator Challenge Management</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Create New Challenge
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {challenges.length === 0 ? (
            <Typography>No challenges found.</Typography>
          ) : (
            challenges.map((challenge) => (
              <Paper key={challenge._id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">{challenge.title}</Typography>
                <Typography>{challenge.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days: {challenge.totalDays} | Participants: {challenge.participantCount}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      )}
      <ChallengeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateChallenge}
      />
    </Box>
  );
};

export default CoordinatorChallenges;