// src/components/VendorCard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Avatar, Typography, Stack, Box } from '@mui/material';
import { getFunctionIcon } from '../utils/iconMapping';

// Define a Set for predefined vendor labels for efficient lookup
const predefinedVendors = new Set([
  "apple",
  "panasonic",
  "msi",
  "google",
  "chromebook",
  "oppo",
  "poco",
  "redmi",
  "roku"
]);

const VendorCard = ({ vendorClassification, functionClassification }) => {
  const label = vendorClassification.label.toLowerCase();
  const isPredefined = predefinedVendors.has(label);

  // Determine the source URL based on the vendor classification
  const avatarSrc = isPredefined
    ? `https://img.logo.dev/${label}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w` // Replace with your alternative logo API URL
    : `https://img.logo.dev/${label}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`;

  // Optional: State to handle fallback image if the primary src fails to load
  const [imgSrc, setImgSrc] = useState(avatarSrc);

  const handleImageError = () => {
    // Set to a default fallback image if the logo fails to load
    setImgSrc('/path/to/default/avatar.png'); // Replace with your fallback image path
  };

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={imgSrc}
          alt={vendorClassification.label}
          sx={{ width: 100, height: 80 }}
          imgProps={{ onError: handleImageError }}
        />
        <Box>
          <Typography variant="h6">{vendorClassification.label}</Typography>
          <Typography variant="body2" color="text.secondary">
            Confidence: {vendorClassification.confidence}
          </Typography>
        </Box>
      </Stack>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {getFunctionIcon(functionClassification.label)}
          <Box>
            <Typography variant="h6">{functionClassification.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {functionClassification.confidence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
