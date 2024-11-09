// src/pages/AboutUsPage.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

import zeal_platform from '../assets/zeal_platform.png'; // Adjust the path as per your project structure

const AboutUsPage = () => {
  const [demoFormData, setDemoFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
  });
  const [formStatus, setFormStatus] = useState(null);

  const [isZoomed, setIsZoomed] = useState(false); // State for image zoom

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDemoFormData({ ...demoFormData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Since we're not sending the data anywhere, we can simply reset the form or display a message
    setFormStatus('success');
    // Reset the form
    setDemoFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      role: '',
    });
  };

  return (
    <Box sx={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Text Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Seeing is Believing
            </Typography>
            <Typography variant="h4" gutterBottom>
              See ZEAL in Action
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', textIndent: '2em' }}>
              Experience visibility into your network devices with ZEAL. Our
              system provides insights into both the vendor and function of devices connected to your network, ensuring security and operational efficiency.
            </Typography>
            {/* Image Section with Hover Effect */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                mt: 2,
                cursor: 'zoom-in',
                '&:hover .hoverOverlay': {
                  opacity: 1,
                },
              }}
              onClick={() => setIsZoomed(true)} // Click to zoom in
            >
              <Box
                component="img"
                src={zeal_platform} // Replace with your image path
                alt="ZEAL Platform"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  border: '2px solid #415A77',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  opacity: 0.9,
                  transition: 'transform 0.3s, box-shadow 0.3s, opacity 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.6)',
                    opacity: 1,
                  },
                }}
              />
              <Box
                className="hoverOverlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  Click to Zoom
                </Typography>
              </Box>
            </Box>
            {/* Zoomed Image Overlay */}
            {isZoomed && (
              <Box
                onClick={() => setIsZoomed(false)} // Click to zoom out
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'zoom-out',
                  zIndex: 1300,
                }}
              >
                <Box
                  component="img"
                  src={zeal_platform} // Replace with your image path
                  alt="ZEAL Platform"
                  sx={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  }}
                />
              </Box>
            )}
          </Grid>
          {/* Contact Form and Testimonial Section */}
          <Grid item xs={12} md={6}>
            <Box
              id="contact-form" // Added ID for direct linking
              sx={{ backgroundColor: '#1B263B', p: 4, borderRadius: 2 }}
            >
              <Typography variant="h5" gutterBottom>
                Get Early Access to ZEAL
              </Typography>
              {formStatus === 'success' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="success.main">
                    Thank you! Your request has been received.
                  </Typography>
                </Box>
              )}
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={demoFormData.firstName}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ backgroundColor: '#415A77', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={demoFormData.lastName}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ backgroundColor: '#415A77', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Business Email"
                      name="email"
                      type="email"
                      value={demoFormData.email}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ backgroundColor: '#415A77', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Organization"
                      name="company"
                      value={demoFormData.company}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ backgroundColor: '#415A77', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Role"
                      name="role"
                      value={demoFormData.role}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      required
                      sx={{ backgroundColor: '#415A77', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        backgroundColor: '#1B9AAA',
                        '&:hover': { backgroundColor: '#128E9E' },
                      }}
                    >
                      <b>Request Demo Access</b>
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
            {/* Testimonial Section */}
            <Box sx={{ mt: 4, borderLeft: '4px solid #ff9900', pl: 2, ml: 1 }}>
              <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#E0E1DD' }}>
                “Orca adds value practically from the first day of use. With other tools, we wait months to see value coming from them.”
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, color: '#E0E1DD' }}>
                — Vivek Menon, VP and CISO, Digital Turbine
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#0D1B2A', py: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* About Us */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  borderLeft: '4px solid #ff9900',
                  pl: 2,
                  mb: 2,
                }}
                gutterBottom
              >
                About ZEAL
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#E0E1DD',
                  textAlign: 'justify',
                  textIndent: '2em',
                }}
              >
                Developed by the research group <strong>Deepness Lab</strong>, ZEAL
                provides a cutting-edge labeling system for unseen IoT devices. Our
                mission is to offer unparalleled visibility into network-connected
                devices, revealing both vendor and function to enhance security and
                operational efficiency.
              </Typography>
            </Grid>
            {/* Social Links */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Connect with Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  component="a"
                  href="https://github.com/barmey/NSDI_Labeling_system"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: '#fff' }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="http://linkedin.com/in/meyuhas/"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: '#fff' }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://scholar.google.com/citations?user=xeWZouIAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: '#fff' }}
                >
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
              © {new Date().getFullYear()} Anat Bremler-Barr, Bar Meyuhas, and Tal Shapira - All Rights Reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUsPage;
