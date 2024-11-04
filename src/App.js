// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, Link as MuiLink } from '@mui/material';
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
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                component="img"
                src={logo}
                alt="System Logo"
                sx={{ height: 80, mr: 2, cursor: 'pointer' }}
              />
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            {/* Updated API / Access Request link */}
            <MuiLink
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: '#fff',
                marginRight: '16px',
                fontSize: '1rem',
                '&:hover': {
                  color: '#ff9900', // Change text color on hover
                  textDecoration: 'underline', // Optional underline on hover
                },
              }}
            >
              API / Access Request
            </MuiLink>
            {/* Enhanced the Classify Device button */}
            <Button
              component={Link}
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