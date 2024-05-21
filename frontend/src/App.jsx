import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MatchListPage from './pages/MatchListPage';
import FightPage from './pages/FightPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/matches"
            element={
              <ProtectedLayout>
                <MatchListPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/matches/:id"
            element={
              <ProtectedLayout>
                <FightPage />
              </ProtectedLayout>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
};

export default App;
