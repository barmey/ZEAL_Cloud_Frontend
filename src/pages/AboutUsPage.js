// src/pages/AboutUsPage.js

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  GitHub as GitHubIcon,
  Radar as RadarIcon,
  TravelExplore as TravelExploreIcon,
  Psychology as PsychologyIcon,
  AutoMode as AutoModeIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import Device3D from '../components/Device3D';
import Reveal from '../components/Reveal';
import { zeal } from '../theme';
import zeal_platform from '../assets/zeal_platform.png';

// Shared section background with a subtle animated grid
const gridBg = {
  backgroundImage: `linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)`,
  backgroundSize: '64px 64px',
  animation: 'gridScroll 14s linear infinite',
};

const STEPS = [
  {
    icon: <RadarIcon sx={{ fontSize: 36, color: zeal.cyan }} />,
    title: 'Extract',
    text: 'ZEAL pulls textual fingerprints straight from the device traffic log — DHCP hostnames, DNS queries, user agents, vendor class IDs.',
  },
  {
    icon: <TravelExploreIcon sx={{ fontSize: 36, color: zeal.cyan }} />,
    title: 'Enrich',
    text: 'Those raw features are enriched with web search data, turning opaque network noise into meaningful device context.',
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 36, color: zeal.cyan }} />,
    title: 'Label',
    text: 'Large language models classify the device against a catalog of known IoT types — zero-shot, no retraining required.',
  },
  {
    icon: <AutoModeIcon sx={{ fontSize: 36, color: zeal.cyan }} />,
    title: 'Evolve',
    text: 'An auto-update mechanism continuously enriches the catalog with emerging device types as the IoT landscape grows.',
  },
];

const STATS = [
  { value: 'Zero-shot', label: 'labels devices never seen before' },
  { value: 'LLM-powered', label: 'reasoning over enriched traffic features' },
  { value: 'Self-updating', label: 'catalog that grows with the IoT market' },
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Scroll-driven rotation for the 3D devices
  const [scrollRot, setScrollRot] = useState(0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setScrollRot(window.scrollY * 0.18);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDemoFormData({ ...demoFormData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const FORM_ENDPOINT = 'https://formspree.io/f/mjkqrwlb';

    setIsSubmitting(true);
    setSubmitError('');
    setFormStatus(null);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          firstName: demoFormData.firstName,
          lastName: demoFormData.lastName,
          email: demoFormData.email,
          company: demoFormData.company,
          role: demoFormData.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFormStatus('success');
      setDemoFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        role: '',
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setSubmitError(
        'Something went wrong sending your request. Please try again or email us at deepnesslab@tauex.tau.ac.il.'
      );
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const location = useLocation();
  const contactFormRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (location.hash === '#contact-form') {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <Box sx={{ backgroundColor: zeal.bg, color: zeal.text, overflow: 'hidden' }}>
      {/* ---------------- HERO ---------------- */}
      <Box sx={{ position: 'relative', ...gridBg }}>
        {/* glow orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 65%)',
            animation: 'orbDrift 16s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -160,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 65%)',
            animation: 'orbDrift 20s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Reveal>
                <Typography
                  sx={{
                    color: zeal.cyan,
                    fontWeight: 600,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    mb: 2,
                  }}
                >
                  Zero-shot Engine for IoT Asset Labeling
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    background: zeal.gradientText,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Know every device on your network.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: zeal.textDim, fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 560, mb: 4 }}
                >
                  ZEAL reveals the vendor and function of any connected IoT device — even ones it has
                  never seen — by combining traffic-log features, web enrichment, and large language
                  models.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={HashLink}
                    smooth
                    to="/classify"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Classify a Device
                  </Button>
                  <Button
                    component={HashLink}
                    smooth
                    to="/#contact-form"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontSize: '1rem', color: zeal.text }}
                  >
                    Get Early Access
                  </Button>
                </Stack>
              </Reveal>
            </Grid>

            {/* 3D devices — rotate while scrolling */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: { xs: 1, md: 2 },
                  mt: { xs: 2, md: 0 },
                }}
              >
                <Device3D type="camera" rotation={scrollRot} baseAngle={-30} scale={0.85} floatClass="float-anim-slow" />
                <Device3D type="speaker" rotation={scrollRot * 1.3} baseAngle={-10} scale={1} floatClass="float-anim" sx={{ marginBottom: 30 }} />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Device3D
                    type="sensor"
                    rotation={scrollRot * 0.8}
                    baseAngle={18}
                    scale={0.7}
                    floatClass="float-anim-fast"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Stats strip */}
          <Reveal delay={1}>
            <Grid container spacing={2} sx={{ mt: { xs: 4, md: 8 } }}>
              {STATS.map((s) => (
                <Grid item xs={12} sm={4} key={s.value}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: zeal.surface,
                      border: `1px solid ${zeal.border}`,
                      backdropFilter: 'blur(14px)',
                      textAlign: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: zeal.blueLight, mb: 0.5 }}>
                      {s.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: zeal.textDim }}>
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Container>
      </Box>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
        <Reveal>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              mb: 1.5,
              background: zeal.gradientText,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            From raw traffic to a named device
          </Typography>
          <Typography sx={{ textAlign: 'center', color: zeal.textDim, mb: 6, maxWidth: 620, mx: 'auto' }}>
            Four stages turn an unknown MAC address into an actionable label.
          </Typography>
        </Reveal>
        <Grid container spacing={3}>
          {STEPS.map((step, i) => (
            <Grid item xs={12} sm={6} md={3} key={step.title}>
              <Reveal delay={Math.min(i, 3)} style={{ height: '100%' }}>
                <Box
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 3,
                    background: zeal.surface,
                    border: `1px solid ${zeal.border}`,
                    backdropFilter: 'blur(14px)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: zeal.borderStrong,
                      boxShadow: `0 16px 40px rgba(37, 99, 235, 0.25)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: `1px solid ${zeal.border}`,
                      mb: 2.5,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    <Box component="span" sx={{ color: zeal.cyan, mr: 1, fontFamily: 'JetBrains Mono, monospace' }}>
                      0{i + 1}
                    </Box>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: zeal.textDim, lineHeight: 1.7 }}>
                    {step.text}
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ---------------- PLATFORM / SEE IT IN ACTION ---------------- */}
      <Box sx={{ position: 'relative', ...gridBg }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Reveal>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                    mb: 2,
                    background: zeal.gradientText,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Seeing is believing.
                </Typography>
                <Typography variant="body1" sx={{ color: zeal.textDim, mb: 3, lineHeight: 1.8 }}>
                  Experience visibility into your network devices with ZEAL. Our system provides
                  insights into both the vendor and function of devices connected to your network,
                  ensuring security and operational efficiency.
                </Typography>

                {/* Platform screenshot with zoom */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 640,
                    cursor: 'zoom-in',
                    '&:hover .hoverOverlay': { opacity: 1 },
                  }}
                  onClick={() => setIsZoomed(true)}
                >
                  <Box
                    component="img"
                    src={zeal_platform}
                    alt="ZEAL Platform"
                    sx={{
                      width: '100%',
                      borderRadius: 3,
                      border: `1px solid ${zeal.borderStrong}`,
                      boxShadow: '0 24px 60px rgba(2, 8, 20, 0.8), 0 0 40px rgba(59,130,246,0.15)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.015)',
                        boxShadow: '0 28px 70px rgba(2, 8, 20, 0.9), 0 0 60px rgba(56,189,248,0.25)',
                      },
                    }}
                  />
                  <Box
                    className="hoverOverlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      backgroundColor: 'rgba(2, 6, 14, 0.45)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h6">Click to zoom</Typography>
                  </Box>
                </Box>
              </Reveal>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Device3D type="router" rotation={scrollRot * 1.1} baseAngle={-20} scale={1.15} floatClass="float-anim-slow" />
              </Box>
              <Reveal delay={1}>
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background: zeal.surface,
                    border: `1px solid ${zeal.border}`,
                    borderLeft: `3px solid ${zeal.cyan}`,
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  <Typography sx={{ fontStyle: 'italic', color: zeal.text, lineHeight: 1.7 }}>
                    “ZEAL transformed our visibility and security of the devices on our network”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1.5, color: zeal.textDim }}>
                    — Industry Expert
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Zoomed Image Overlay */}
      {isZoomed && (
        <Box
          onClick={() => setIsZoomed(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 5, 11, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
            zIndex: 1300,
          }}
        >
          <Box
            component="img"
            src={zeal_platform}
            alt="ZEAL Platform"
            sx={{
              maxWidth: '92%',
              maxHeight: '92%',
              borderRadius: 2,
              boxShadow: '0 4px 40px rgba(0, 0, 0, 0.6)',
            }}
          />
        </Box>
      )}

      {/* ---------------- CONTACT / EARLY ACCESS ---------------- */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Reveal>
          <Box
            id="contact-form"
            ref={contactFormRef}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: zeal.surface,
              border: `1px solid ${highlight ? zeal.cyan : zeal.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: highlight
                ? `0 0 40px 4px rgba(56, 189, 248, 0.35)`
                : '0 24px 60px rgba(2, 8, 20, 0.6)',
              transition: 'box-shadow 0.5s, border-color 0.5s',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontSize: { xs: '1.6rem', md: '2rem' },
                background: zeal.gradientText,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Get early access to ZEAL
            </Typography>
            <Typography sx={{ color: zeal.textDim, mb: 4 }}>
              Request a demo and an API key — we will get back to you shortly.
            </Typography>

            {formStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you! Your request has been received.
              </Alert>
            )}
            {formStatus === 'error' && submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={demoFormData.firstName}
                    onChange={handleFormChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={demoFormData.lastName}
                    onChange={handleFormChange}
                    fullWidth
                    variant="outlined"
                    required
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Organization"
                    name="company"
                    value={demoFormData.company}
                    onChange={handleFormChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    name="role"
                    value={demoFormData.role}
                    onChange={handleFormChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ py: 1.5, fontSize: '1rem' }}
                  >
                    {isSubmitting ? 'Sending…' : 'Request Demo Access'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Reveal>
      </Container>

      {/* ---------------- FOOTER ---------------- */}
      <Box sx={{ borderTop: `1px solid ${zeal.border}`, py: 6, background: zeal.bgRaised }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, color: zeal.blueLight }}>
                About ZEAL
              </Typography>
              <Typography variant="body2" sx={{ color: zeal.textDim, lineHeight: 1.8, maxWidth: 560 }}>
                Developed by the research group, ZEAL provides a cutting-edge labeling system for
                unseen IoT devices. Our mission is to offer unparalleled visibility into
                network-connected devices, revealing both vendor and function to enhance security
                and operational efficiency.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ mb: 2, color: zeal.blueLight }}>
                Connect with us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconButton
                  component="a"
                  href="https://github.com/barmey/"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: zeal.text,
                    border: `1px solid ${zeal.border}`,
                    '&:hover': { borderColor: zeal.cyan, color: zeal.cyan },
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.linkedin.com/in/meyuhas/"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: zeal.text,
                    border: `1px solid ${zeal.border}`,
                    '&:hover': { borderColor: zeal.cyan, color: zeal.cyan },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://scholar.google.com/citations?user=xeWZouIAAAAJ&hl=en&authuser=1"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: zeal.text,
                    border: `1px solid ${zeal.border}`,
                    '&:hover': { borderColor: zeal.cyan, color: zeal.cyan },
                  }}
                >
                  <SchoolIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 5, pt: 3, borderTop: `1px solid ${zeal.border}`, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: zeal.textDim }}>
              © {new Date().getFullYear()} ZEAL — All Rights Reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUsPage;
