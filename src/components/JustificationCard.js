// src/components/JustificationCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';

const JustificationCard = ({ justification }) => {
  return (
    <Card sx={{ p: 2, mt: 2, backgroundColor: '#f9f9f9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Justification:
        </Typography>
        <Box>
          <Typography variant="body1" color="text.secondary">
            {justification}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

JustificationCard.propTypes = {
  justification: PropTypes.string.isRequired,
};

export default JustificationCard;
