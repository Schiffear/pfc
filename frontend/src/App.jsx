import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MatchListPage from './pages/MatchListPage';
import MatchPage from './pages/MatchPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/matches/:id" element={<MatchPage />} />
        <Route path="/matches" element={<MatchListPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
