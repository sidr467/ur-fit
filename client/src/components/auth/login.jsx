import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import sideImage from '../../assets/side-image.jpeg';
import { login as loginService } from '../../services/api';
import Navbar from '../Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginService(formData);
      if (!res.data.token) {
        setError(res.data.message || 'Login failed');
        return;
      }
      localStorage.setItem('token', res.data.token);
      navigate('/challenges');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Top Navigation Bar */}
      <Navbar></Navbar>

      {/* Main Content - Two Equal Columns */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Side - Background Image */}
        <Box sx={{ 
          flex: 1,
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${sideImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Right Side - Login Form */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
          overflowY: 'auto',
          padding: '20px'
        }}>
          <Box sx={{ 
            width: '100%',
            maxWidth: '400px',
            padding: '40px'
          }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
              Sign in
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  py: 1.5,
                  mb: 2,
                  backgroundColor: 'black',
                  '&:hover': { backgroundColor: '#333' }
                }}
              >
                Sign in
              </Button>
            </form>
            
            <Typography align="center">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'black', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;