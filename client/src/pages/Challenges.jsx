import React from 'react';
import { jwtDecode } from 'jwt-decode';  // ✅ Named import
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let user = {};

  try {
    if (token) {
      user = jwtDecode(token);
      console.log("Decoded token:", user);
    }
  } catch (err) {
    console.error('Invalid token', err);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box p={3}>
      <Typography variant="h5">
        Welcome, {user?.name || 'User'}!
      </Typography>
      <Typography variant="body1">
        Email: {user?.email}
      </Typography>
      <Button onClick={handleLogout} variant="outlined" sx={{ mt: 2 }}>
        Logout
      </Button>
    </Box>
  );
};

export default Challenges;
