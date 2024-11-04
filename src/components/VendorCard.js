// src/components/VendorCard.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Avatar, Typography, Stack, Box } from '@mui/material';

const VendorCard = ({ vendorClassification, functionClassification }) => {
  const label = vendorClassification.label.toLowerCase();
  const functionLabel = functionClassification.label.toLowerCase();

  // Determine the source URL for vendor icon based on classification label
  const avatarSrc = `https://img.logo.dev/${label}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`;

  // Set a specific default image for "unknown" function
  const functionIconSrc = functionLabel === "unknown"
    ? '/path/to/unknown_function_icon.png' // Replace with your "unknown" function icon path
    : `https://img.logo.dev/${functionLabel}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`;

  // State to handle fallback images if the primary sources fail to load
  const [imgSrc, setImgSrc] = useState(avatarSrc);
  const [functionIcon, setFunctionIcon] = useState(functionIconSrc);

  const handleImageError = () => {
    setImgSrc('/path/to/default/avatar.png'); // Replace with your fallback vendor image path
  };

  const handleFunctionIconError = () => {
    setFunctionIcon('/path/to/default/function_icon.png'); // Replace with your fallback function icon path
  };

  return (
    <Card sx={{ p: 2, mb: 2, backgroundColor: '#415A77', color: '#E0E1DD' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={imgSrc}
          alt={vendorClassification.label}
          sx={{ width: 100, height: 80 }}
          imgProps={{ onError: handleImageError }}
        />
        <Box>
          <Typography variant="h6" sx={{ color: '#E0E1DD' }}>
            {vendorClassification.label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
            Confidence: {Math.round(vendorClassification.confidence * 100)}%
          </Typography>
        </Box>
      </Stack>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={functionIcon}
            alt={functionClassification.label}
            sx={{ width: 50, height: 50 }}
            imgProps={{ onError: handleFunctionIconError }}
          />
          <Box>
            <Typography variant="h6" sx={{ color: '#E0E1DD' }}>
              {functionClassification.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
              Confidence: {Math.round(functionClassification.confidence * 100)}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
              {functionClassification.justification}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

VendorCard.propTypes = {
  vendorClassification: PropTypes.shape({
    label: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
  functionClassification: PropTypes.shape({
    label: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
    justification: PropTypes.string.isRequired,
  }).isRequired,
};

export default VendorCard;