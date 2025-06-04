import React, { useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'participant' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box width={300} mx="auto" mt={5}>
      <Typography variant="h5">Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <Typography variant="subtitle1" mt={2}>Select Role:</Typography>
        <RadioGroup name="role"
          value={form.role}
          onChange={handleChange}
          row>
          <FormControlLabel value="participant" control={<Radio />} label="Participant" />
          <FormControlLabel value="coordinator" control={<Radio />} label="Coordinator" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
      </form>
      <Typography variant="body2" align="center" mt={2}>
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </Typography>
    </Box>
  );
};

export default Signup;
