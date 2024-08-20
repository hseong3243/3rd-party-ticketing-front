import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';

import Signup from './components/Signup.js';
import Login from './components/Login.js';
import PerformanceList from './components/PerformanceList.js';
import PerformanceWaiting from './components/PerformanceWaiting.js';
import PerformanceSelect from './components/PerformanceSelect';
import PerformancePayment from './components/PerformancePayment.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/performances" element={<PerformanceList />} />
            <Route path="/performances/:performanceId/waiting" element={<PerformanceWaiting />} />
            <Route path="/performances/:performanceId/select" element={<PerformanceSelect />} />
            <Route path="/performances/:performanceId/payment" element={<PerformancePayment />} />
            <Route path="/" element={<PerformanceList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isLoggedIn) {
      onLogout();
    }
    navigate(isLoggedIn ? '/' : '/login');
  };

  return (
    <header>
      <nav>
        <div>
          <NavLink to="/" end>홈</NavLink>
          <NavLink to="/performances">공연 목록</NavLink>
        </div>
        <div>
          {!isLoggedIn && (
            <NavLink to="/signup" className="signup-button">회원가입</NavLink>
          )}
          <button onClick={handleAuthAction}>
            {isLoggedIn ? '로그아웃' : '로그인'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default App;