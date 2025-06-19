import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Container,
  Typography,
  Box,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  getAllUsers,
  getAllChallenges,
  userEnrollment,
  getChallengeById,
} from "../services/api";
import Navbar from "../components/Navbar";

const EnrollUser = () => {
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [enrolledUserIds, setEnrolledUserIds] = useState([]);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;

  try {
    if (token) user = jwtDecode(token);
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "coordinator") {
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    getAllUsers(token)
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
    getAllChallenges(token)
      .then((res) => setChallenges(res.data))
      .catch(() => setChallenges([]));
  }, [token]);

  useEffect(() => {
    if (selectedChallenge) {
      getChallengeById(selectedChallenge, token)
        .then((challenge) => {
          const ids = Array.isArray(challenge.participants)
            ? challenge.participants.map((u) =>
                typeof u === "string" ? u : String(u._id)
              )
            : [];
          setEnrolledUserIds(ids);
        })
        .catch(() => setEnrolledUserIds([]));
    } else {
      setEnrolledUserIds([]);
    }
  }, [selectedChallenge, token]);

  const handleEnroll = (userId) => {
    if (!selectedChallenge) {
      setSnackbar({
        open: true,
        message: "Please select a challenge first.",
        severity: "error",
      });
      return;
    }
    userEnrollment({ userId, challengeId: selectedChallenge }, token)
      .then((res) => {
        setSnackbar({
          open: true,
          message: res.data.message || "Enrolled!",
          severity: "success",
        });
        return getChallengeById(selectedChallenge, token);
      })
      .then((challenge) => {
        const ids = Array.isArray(challenge.participants)
          ? challenge.participants.map((u) =>
              typeof u === "string" ? u : String(u._id)
            )
          : [];
        setEnrolledUserIds(ids);
      })
      .catch((err) =>
        setSnackbar({
          open: true,
          message:
            err.response?.data?.message ||
            "Enrollment failed. User may already be enrolled.",
          severity: "error",
        })
      );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          User Enrollment
        </Typography>
        <Box
          display="flex"
          gap={2}
          mb={3}
          alignItems="center"
          flexWrap="wrap"
        >
          <TextField
            label="Search users"
            variant="outlined"
            value={search}
            color="black"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
          <Select
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            displayEmpty
            color="black"
            variant="outlined"
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="">
              <em>Select a challenge</em>
            </MenuItem>
            {challenges.map((challenge) => (
              <MenuItem key={challenge._id} value={challenge._id}>
                {challenge.title}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Table
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {enrolledUserIds.includes(String(user._id)) ? (
                    <span style={{ color: "#4caf50" }}>Enrolled</span>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEnroll(user._id)}
                      sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#333" },
                      }}
                    >
                      Enroll
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
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
  );
};

export default EnrollUser;