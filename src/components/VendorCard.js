import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Avatar, Typography, Stack, Box, IconButton } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const VendorCard = ({
  vendorClassification,
  functionClassification,
  vendorFeedback,
  onVendorFeedback,
  functionFeedback,
  onFunctionFeedback,
}) => {
  // Normalize labels (fallback to empty string if not provided)
  const vendorLabel = (vendorClassification?.label || "").toLowerCase();
  const functionLabel = (functionClassification?.label || "").toLowerCase();

  // Default fallback images
  const defaultVendorIcon = '/path/to/default/avatar.png';
  const defaultFunctionIcon = '/path/to/default/function_icon.png';

  const [imgSrc, setImgSrc] = useState(defaultVendorIcon);
  const [functionIcon, setFunctionIcon] = useState(defaultFunctionIcon);
  const [localVendorMsg, setLocalVendorMsg] = useState('');
  const [localFunctionMsg, setLocalFunctionMsg] = useState('');

  useEffect(() => {
    if (vendorLabel) {
      setImgSrc(`https://img.logo.dev/${vendorLabel}.com?token=pk_MJLPtkW9ToSWXPNdIBNy6w`);
    } else {
      setImgSrc(defaultVendorIcon);
    }
  }, [vendorLabel]);

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

  const handleVendorFeedback = (value) => {
    if (onVendorFeedback) {
      onVendorFeedback(value);
      setLocalVendorMsg("Thank you for your feedback!");
      setTimeout(() => setLocalVendorMsg(""), 2500);
    }
  };

  const handleFunctionFeedback = (value) => {
    if (onFunctionFeedback) {
      onFunctionFeedback(value);
      setLocalFunctionMsg("Thank you for your feedback!");
      setTimeout(() => setLocalFunctionMsg(""), 2500);
    }
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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ color: '#E0E1DD' }}>
              {vendorClassification.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
              (Confidence: {Math.round(vendorClassification.confidence * 100)}%)
            </Typography>
            {/* Render vendor feedback icons only if a vendor label exists */}
            {vendorClassification.label && (
              <>
                <IconButton
                  onClick={() => handleVendorFeedback('Correct')}
                  sx={{
                    color: vendorFeedback === 'Correct' ? '#4caf50' : '#4caf50',
                    '&.Mui-disabled': { color: vendorFeedback === 'Correct' ? '#4caf50' : '#9e9e9e' },
                  }}
                  disabled={vendorFeedback !== ""}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleVendorFeedback('Incorrect')}
                  sx={{
                    color: vendorFeedback === 'Incorrect' ? '#f44336' : '#f44336',
                    '&.Mui-disabled': { color: vendorFeedback === 'Incorrect' ? '#f44336' : '#9e9e9e' },
                  }}
                  disabled={vendorFeedback !== ""}
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}
            {localVendorMsg && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                {localVendorMsg}
              </Typography>
            )}
          </Stack>
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
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ color: '#E0E1DD' }}>
                {functionClassification.label}
              </Typography>
              <Typography variant="body2" sx={{ color: '#E0E1DD' }}>
                (Confidence: {Math.round(functionClassification.confidence * 100)}%)
              </Typography>
              {/* Render function feedback icons only if function label exists */}
              {functionClassification.label && (
                <>
                  <IconButton
                    onClick={() => handleFunctionFeedback('Correct')}
                    sx={{
                      color: functionFeedback === 'Correct' ? '#4caf50' : '#4caf50',
                      '&.Mui-disabled': { color: functionFeedback === 'Correct' ? '#4caf50' : '#9e9e9e' },
                    }}
                    disabled={functionFeedback !== ""}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleFunctionFeedback('Incorrect')}
                    sx={{
                      color: functionFeedback === 'Incorrect' ? '#f44336' : '#f44336',
                      '&.Mui-disabled': { color: functionFeedback === 'Incorrect' ? '#f44336' : '#9e9e9e' },
                    }}
                    disabled={functionFeedback !== ""}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              )}
              {localFunctionMsg && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {localFunctionMsg}
                </Typography>
              )}
            </Stack>
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
  vendorFeedback: PropTypes.string,
  onVendorFeedback: PropTypes.func,
  functionFeedback: PropTypes.string,
  onFunctionFeedback: PropTypes.func,
};

export default VendorCard;