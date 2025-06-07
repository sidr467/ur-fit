import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Home from './pages/Home';
import Challenges from './pages/Challenges';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/challenges" element={<Challenges />} />
      </Routes>
    </Router>
  );
};

export default App;
