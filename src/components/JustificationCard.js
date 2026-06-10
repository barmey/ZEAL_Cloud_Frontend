// src/components/JustificationCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { zeal } from '../theme';

const JustificationCard = ({ justification }) => {
  return (
    <Card
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 3,
        borderLeft: `3px solid ${zeal.cyan}`,
      }}
    >
      <CardContent>
        <Typography variant="overline" gutterBottom sx={{ color: zeal.cyan }}>
          Justification
        </Typography>
        <Box>
          <Typography variant="body1" sx={{ color: zeal.text, lineHeight: 1.8 }}>
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
