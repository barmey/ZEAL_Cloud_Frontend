// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { HashLink } from 'react-router-hash-link';
import AboutUsPage from './pages/AboutUsPage';
import ClassifyDevicePage from './pages/ClassifyDevicePage';
import { zeal } from './theme';
import logo from './assets/logo.png';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleApiAccessRequestClick = (e) => {
    e.preventDefault();
    setDrawerOpen(false);
    // Reset the hash to allow re-triggering the useEffect in AboutUsPage
    window.location.hash = '';
    // After a short delay, set the hash to '#contact-form'
    setTimeout(() => {
      window.location.hash = '#contact-form';
    }, 100); // 100ms delay
  };

  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: zeal.bg }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: 'rgba(4, 7, 13, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${zeal.border}`,
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>
            <HashLink
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="ZEAL Logo"
                sx={{
                  height: { xs: 44, md: 56 },
                  mr: 1.5,
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.45))',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  background: zeal.gradientText,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                ZEAL
              </Typography>
            </HashLink>
            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              <HashLink
                smooth
                to="/#contact-form"
                style={{ textDecoration: 'none' }}
                onClick={handleApiAccessRequestClick}
              >
                <Typography
                  sx={{
                    color: zeal.text,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'color 0.3s',
                    '&:hover': { color: zeal.cyan },
                  }}
                >
                  API / Access Request
                </Typography>
              </HashLink>
              <Button
                component={HashLink}
                smooth
                to="/classify"
                variant="contained"
                color="primary"
                sx={{ px: 3 }}
              >
                Classify Device
              </Button>
            </Box>

            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: zeal.text }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 280,
              background: 'rgba(7, 13, 24, 0.96)',
              backdropFilter: 'blur(20px)',
              borderLeft: `1px solid ${zeal.border}`,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5 }}>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: zeal.text }} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 2 }}>
            <ListItemButton
              component={HashLink}
              to="/"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton
              component={HashLink}
              smooth
              to="/#contact-form"
              onClick={handleApiAccessRequestClick}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemText primary="API / Access Request" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <Button
              component={HashLink}
              smooth
              to="/classify"
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              sx={{ mt: 1 }}
            >
              Classify Device
            </Button>
          </List>
        </Drawer>

        {/* Spacer for the fixed AppBar */}
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />

        <Routes>
          <Route path="/" element={<AboutUsPage />} />
          <Route path="/classify" element={<ClassifyDevicePage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
