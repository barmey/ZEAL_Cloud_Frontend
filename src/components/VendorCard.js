import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Avatar, Typography, Stack, Box } from '@mui/material';

const VendorCard = ({ vendorClassification, functionClassification }) => {
  // Normalize the labels to lower case (or empty string if not provided)
  const vendorLabel = (vendorClassification?.label || "").toLowerCase();
  const functionLabel = (functionClassification?.label || "").toLowerCase();

  // Default fallback images
  const defaultVendorIcon = '/path/to/default/avatar.png';
  const defaultFunctionIcon = '/path/to/default/function_icon.png';

  // State for icon URLs
  const [imgSrc, setImgSrc] = useState(defaultVendorIcon);
  const [functionIcon, setFunctionIcon] = useState(defaultFunctionIcon);

  // Update the vendor icon URL when vendorLabel changes
  useEffect(() => {
    if (vendorLabel) {
      setImgSrc(`https://img.logo.dev/${vendorLabel}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`);
    } else {
      setImgSrc(defaultVendorIcon);
    }
  }, [vendorLabel]);

  // Update the function icon URL when functionLabel changes
  useEffect(() => {
    if (functionLabel && functionLabel !== "unknown") {
      setFunctionIcon(`https://img.logo.dev/${functionLabel}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`);
    } else {
      setFunctionIcon(defaultFunctionIcon);
    }
  }, [functionLabel]);

  const handleImageError = () => {
    setImgSrc(defaultVendorIcon);
  };

  const handleFunctionIconError = () => {
    setFunctionIcon(defaultFunctionIcon);
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
