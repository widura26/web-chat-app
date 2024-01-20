// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
// import Cookies from 'js-cookie';
import Home from './pages/home';
import React from 'react';

function App() {
  // const [showNavbar, setShowNavbar] = useState(true);
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
