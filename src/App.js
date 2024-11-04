// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import AboutUsPage from './pages/AboutUsPage';
import ClassifyDevicePage from './pages/ClassifyDevicePage';
import logo from './assets/logo.png'; // Adjust the path as per your project structure

const App = () => {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A2342' }}> {/* Set background for the entire app */}
        <AppBar position="static" sx={{ backgroundColor: '#0A2342' }}> {/* Dark blue background color */}
          <Toolbar sx={{ p: 0 }}> {/* Remove padding to avoid white space */}
            <Box component="img" src={logo} alt="System Logo" sx={{ height: 100, mr: 2 }} /> {/* Logo on the left */}
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push buttons to the right */}
            <Button color="inherit" component={Link} to="/">
              About Us
            </Button>
            <Button color="inherit" component={Link} to="/classify">
              Classify Device
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<AboutUsPage />} />
          <Route path="/classify" element={<ClassifyDevicePage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;