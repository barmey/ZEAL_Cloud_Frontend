// src/components/JustificationCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';

const JustificationCard = ({ justification }) => {
  return (
    <Card sx={{ p: 2, mt: 2, backgroundColor: '#415A77', color: '#E0E1DD' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#E0E1DD' }}>
          Justification:
        </Typography>
        <Box>
          <Typography variant="body1" sx={{ color: '#E0E1DD' }}>
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