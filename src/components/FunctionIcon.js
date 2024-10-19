// src/components/FunctionIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import { FaCog, FaBolt, FaCloud, FaDatabase } from 'react-icons/fa'; // Import desired icons

const iconMapping = {
  FaCog: <FaCog />,
  FaBolt: <FaBolt />,
  FaCloud: <FaCloud />,
  FaDatabase: <FaDatabase />,
  // Add more mappings as needed
};

const FunctionIcon = ({ icon }) => {
  return (
    <div style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
      {iconMapping[icon] || <FaCog />} {/* Default icon */}
    </div>
  );
};

FunctionIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default FunctionIcon;
