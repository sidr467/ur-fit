import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import sideImage from '../../assets/signupImage.jpeg';
import { signup as signupService } from '../../services/api';
import Navbar from '../Navbar'; // Assuming you have a Navbar component

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'participant' // Default selection
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  try {
    const res = await signupService(formData);
    if (res.data && res.data.message && res.data.message.toLowerCase().includes('error')) {
      setError(res.data.message || 'Signup failed');
      return;
    }
    setSuccess('Signup successful! Redirecting to login...');
    setTimeout(() => navigate('/login'), 1500);
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

        {/* Right Side - Sign Up Form */}
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
              Create Account
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
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
                required
              />

              {/* User Type Selection */}
              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel component="legend">I am a:</FormLabel>
                <RadioGroup
                  row
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value="participant" 
                    control={<Radio />} 
                    label="Participant" 
                  />
                  <FormControlLabel 
                    value="coordinator" 
                    control={<Radio />} 
                    label="Coordinator" 
                  />
                </RadioGroup>
              </FormControl>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" sx={{ mb: 2 }}>
                  {success}
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
                Sign Up
              </Button>
            </form>
            
            <Typography align="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpPage;