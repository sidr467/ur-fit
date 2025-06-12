import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f9f9f9"
      padding={4}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Campus Wellness Challenge
      </Typography>
      <Typography variant="h6" gutterBottom>
        Join wellness challenges and build healthy habits with your university community.
      </Typography>

      <Box mt={4}>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            fontWeight: 500,
            borderRadius: '4px',
            marginRight: 2,
            '&:hover': {
              backgroundColor: '#333',
              color: '#fff'
            }
          }}
        >
          Login
        </Button>

        <Button
          component={Link}
          to="/signup"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            fontWeight: 500,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#333',
              color: '#fff'
            }
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Home;