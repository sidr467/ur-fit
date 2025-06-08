import React from 'react';
import { jwtDecode } from 'jwt-decode';  
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let user = null;

  try {
    if (token) {
      user = jwtDecode(token);
    }
  } catch (err) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    // Option 1: Redirect to login
    navigate('/login');
    return null;

    // Option 2: Just render nothing
    // return null;
  }

  return (
    <Box p={3}>
      <Typography variant="h5">
        Welcome, {user.name}!
      </Typography>
      <Typography variant="body1">
        Email: {user.email}
      </Typography>
      <Button onClick={handleLogout} variant="outlined" sx={{ mt: 2 }}>
        Logout
      </Button>
    </Box>
  );
};

export default Challenges;