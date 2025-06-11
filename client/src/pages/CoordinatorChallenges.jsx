import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllChallenges, createChallenge } from "../services/api";
import ChallengeModal from "../components/ChallengeModal";
import ChallengeCard from "../components/ChallengeCard";

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
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const res = await getAllChallenges(token);
    setChallenges(res.data);
    setLoading(false);
  };

  const handleCreateChallenge = async (challengeData) => {
    try {
      await createChallenge(challengeData, token);
      setModalOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  if (!user || user.role !== "coordinator") return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Navbar user={user} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Coordinator Dashboard
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: '#000',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Create New Challenge
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: 'repeat(3, 1fr)'
            },
            '@media (max-width: 900px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            {challenges.length === 0 ? (
              <Grid item xs={12} sx={{ gridColumn: '1 / -1' }}>
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" color="text.secondary">
                    No challenges created yet
                  </Typography>
                </Box>
              </Grid>
            ) : (
              challenges.map((challenge) => (
                <Box key={challenge._id} sx={{ width: '100%' }}>
                  <ChallengeCard
                    challenge={challenge}
                    isCoordinator={true}
                    onJoin={() => {}} 
                    isJoined={false}
                  />
                </Box>
              ))
            )}
          </Grid>
        )}

        {/* Create Challenge Modal */}
        <ChallengeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateChallenge}
        />
      </Container>
    </Box>
  );
};

export default CoordinatorChallenges;