// src/utils/iconMapping.js
import DesktopPCIcon from '../assets/icons/DesktopPCIcon';
import LaptopIcon from '../assets/icons/LaptopIcon';
import PhoneIcon from '../assets/icons/PhoneIcon';
import SmartTVIcon from '../assets/icons/SmartTVIcon';
import StreamerIcon from '../assets/icons/StreamerIcon';
import TabletIcon from '../assets/icons/TabletIcon';
import { Box } from '@mui/material';
import { FaCog } from 'react-icons/fa'; // Import FaCog for default use

// Import other custom icons as needed

export const getFunctionIcon = (functionLabel) => {
  switch (functionLabel.toLowerCase()) {
    case 'streamer':
      return <StreamerIcon/>;
    case 'phone':
      return <PhoneIcon style={{ width: '24px', height: '24px' }} />;
    case 'laptop':
      return <LaptopIcon style={{ width: '24px', height: '24px' }} />;
    case 'tablet':
      return <TabletIcon style={{ width: '24px', height: '24px' }} />;
    case 'desktop pc':
      return <DesktopPCIcon style={{ width: '24px', height: '24px' }} />;
    case 'smart tv':
      return <SmartTVIcon style={{ width: '24px', height: '24px' }} />;
    default:
      return <FaCog style={{ width: '24px', height: '24px' }} />;
  }
};
