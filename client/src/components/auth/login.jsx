import React, { useState } from 'react';
import API from '../../services/api';
import {Link} from 'react-router-dom'
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      alert(res.data.message);
      localStorage.setItem('token', res.data.token);  // Store JWT
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box width={300} mx="auto" mt={5}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
      <Typography variant="body2" align="center" mt={2}>
        Don't have an account?{' '}
        <Link to="/signup">Signup</Link>
      </Typography>
    </Box>
  );
};

export default Login;
