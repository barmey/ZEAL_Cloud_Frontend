// src/JsonViewer.js
import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // You can choose other themes
import { Box, Typography, Paper } from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';

const JsonViewer = ({ data }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        <InsertDriveFileOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
        Fetched JSON Data:
      </Typography>
      <Paper elevation={3} sx={{ p: 2, maxHeight: '60vh', overflowY: 'auto', backgroundColor: '#2d2d2d' }}>
        <JSONPretty data={data} theme="monikai" />
      </Paper>
    </Box>
  );
};

JsonViewer.propTypes = {
  data: PropTypes.object.isRequired,
};

export default JsonViewer;
