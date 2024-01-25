// import logo from './logo.svg';
// import './App.css';
// import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
// import Cookies from 'js-cookie';
import Home from './pages/home';
import React from 'react';

function App() {
  // axios.defaults.baseURL = 'http://localhost:3000';
  // axios.defaults.withCredentials = true;
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/profile" element={<Dashboard />} />
        </Routes>
      </Router>
  );
}

export default App;
