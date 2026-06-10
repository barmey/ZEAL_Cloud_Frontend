import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { zeal } from '../theme';

const ConfidenceBar = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
    <LinearProgress
      variant="determinate"
      value={Math.max(0, Math.min(100, value))}
      sx={{
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        '& .MuiLinearProgress-bar': {
          borderRadius: 3,
          background: zeal.gradientBtn,
        },
      }}
    />
    <Typography variant="caption" sx={{ color: zeal.textDim, minWidth: 38 }}>
      {value}%
    </Typography>
  </Box>
);

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
    <Card
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 12px 32px rgba(2, 8, 20, 0.5)',
      }}
    >
      {/* Vendor */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={imgSrc}
          alt={vendorClassification.label}
          sx={{
            width: 72,
            height: 72,
            backgroundColor: '#fff',
            border: `2px solid ${zeal.border}`,
            p: 0.5,
          }}
          imgProps={{ onError: handleImageError }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: zeal.cyan, lineHeight: 1.4 }}>
            Vendor
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="h6">{vendorClassification.label}</Typography>
            {/* Render vendor feedback icons only if a vendor label exists */}
            {vendorClassification.label && (
              <>
                <IconButton
                  size="small"
                  onClick={() => handleVendorFeedback('Correct')}
                  sx={{
                    color: '#4caf50',
                    '&.Mui-disabled': { color: vendorFeedback === 'Correct' ? '#4caf50' : '#9e9e9e' },
                  }}
                  disabled={vendorFeedback !== ""}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleVendorFeedback('Incorrect')}
                  sx={{
                    color: '#f44336',
                    '&.Mui-disabled': { color: vendorFeedback === 'Incorrect' ? '#f44336' : '#9e9e9e' },
                  }}
                  disabled={vendorFeedback !== ""}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            )}
            {localVendorMsg && (
              <Typography variant="caption" sx={{ color: zeal.textDim }}>
                {localVendorMsg}
              </Typography>
            )}
          </Stack>
          <ConfidenceBar value={Math.round(vendorClassification.confidence * 100) || 0} />
        </Box>
      </Stack>

      {/* Function */}
      <CardContent sx={{ px: 0, pb: '8px !important' }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            src={functionIcon}
            alt={functionClassification.label}
            sx={{
              width: 52,
              height: 52,
              backgroundColor: '#fff',
              border: `2px solid ${zeal.border}`,
              p: 0.5,
            }}
            imgProps={{ onError: handleFunctionIconError }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: zeal.cyan, lineHeight: 1.4 }}>
              Function
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h6">{functionClassification.label}</Typography>
              {/* Render function feedback icons only if function label exists */}
              {functionClassification.label && (
                <>
                  <IconButton
                    size="small"
                    onClick={() => handleFunctionFeedback('Correct')}
                    sx={{
                      color: '#4caf50',
                      '&.Mui-disabled': { color: functionFeedback === 'Correct' ? '#4caf50' : '#9e9e9e' },
                    }}
                    disabled={functionFeedback !== ""}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleFunctionFeedback('Incorrect')}
                    sx={{
                      color: '#f44336',
                      '&.Mui-disabled': { color: functionFeedback === 'Incorrect' ? '#f44336' : '#9e9e9e' },
                    }}
                    disabled={functionFeedback !== ""}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              {localFunctionMsg && (
                <Typography variant="caption" sx={{ color: zeal.textDim }}>
                  {localFunctionMsg}
                </Typography>
              )}
            </Stack>
            <ConfidenceBar value={Math.round(functionClassification.confidence * 100) || 0} />
            {functionClassification.justification && (
              <Typography variant="body2" sx={{ color: zeal.textDim, mt: 1.5, lineHeight: 1.7 }}>
                {functionClassification.justification}
              </Typography>
            )}
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
