// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { HashLink } from 'react-router-hash-link'; // Import HashLink
import AboutUsPage from './pages/AboutUsPage';
import ClassifyDevicePage from './pages/ClassifyDevicePage';
import logo from './assets/logo.png'; // Adjust the path as per your project structure

const App = () => {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A2342' }}>
        <AppBar position="static" sx={{ backgroundColor: '#0A2342' }}>
          <Toolbar sx={{ p: 0 }}>
            {/* Logo is now a clickable link to the About Us page */}
            <HashLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                component="img"
                src={logo}
                alt="System Logo"
                sx={{ height: 80, mr: 2, cursor: 'pointer' }}
              />
            </HashLink>
            <Box sx={{ flexGrow: 1 }} />
            {/* Updated API / Access Request link to scroll to contact form */}
            <HashLink
              smooth
              to="/#contact-form" // Link to the contact form section
              style={{ textDecoration: 'none', color: '#fff', marginRight: '16px' }}
            >
              <Typography variant="h6" sx={{ fontSize: '1rem', transition: 'color 0.3s', '&:hover': { color: '#ff9900', textDecoration: 'underline' } }}>
                API / Access Request
              </Typography>
            </HashLink>
            {/* Enhanced the Classify Device button */}
            <Button
              component={HashLink}
              smooth
              to="/classify"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#ff9900',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#ff9900' },
              }}
            >
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
