import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import CoordinatorChallenges from './pages/CoordinatorChallenges';
import ChallengeDetails from './pages/ChallengeDetails';
import EnrollUser from './pages/EnrollUser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/coordinator-challenges" element={<CoordinatorChallenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetails />} />
        <Route path='/enrollment' element={<EnrollUser/>}/>
      </Routes>
    </Router>
  );
};

export default App;
