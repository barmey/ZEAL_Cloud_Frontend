// src/App.js
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './App.css';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Alert,
  Stack,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import VendorCard from './components/VendorCard'; // Import VendorCard component
import JustificationCard from './components/JustificationCard'; // Import JustificationCard
import { getFunctionIcon } from './utils/iconMapping'; // Import helper function
import { v4 as uuidv4 } from 'uuid'; // Import UUID for random name generation

Amplify.configure(awsExports);

const App = () => {
  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    jsonFile: null,
  });
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'file'
  const [isPolling, setIsPolling] = useState(false); // Indicates if polling is in progress
  const [pollingMessage, setPollingMessage] = useState(''); // Message to display during polling
  const [jsonData, setJsonData] = useState({
    vendor_classification: {},
    function_classification: {}
  }); // Initialize with correct structure

  // State for manual input fields
  const [manualInput, setManualInput] = useState({
    mac_address: '',
    oui_vendor: '',
    'dhcp.option.hostname': '',
    'dns.qry.name': '',
    'http.user_agent': '',
    'dns.ptr.domain_name': '',
    'dhcp.option.vendor_class_id': '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput({ ...manualInput, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, jsonFile: file });
      console.log('File selected:', file.name);
    }
  };

  const handleInputMethodChange = (e) => {
    setInputMethod(e.target.value);
    setFormData({ ...formData, jsonFile: null }); // Reset JSON file
    setManualInput({
      mac_address: '',
      oui_vendor: '',
      'dhcp.option.hostname': '',
      'dns.qry.name': '',
      'http.user_agent': '',
      'dns.ptr.domain_name': '',
      'dhcp.option.vendor_class_id': '',
    }); // Reset manual input
    setJsonData({
      vendor_classification: {},
      function_classification: {}
    }); // Reset JSON data
    setStatus(null); // Reset status
    console.log('Input method changed to:', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null); // Reset status
    setPollingMessage(''); // Reset polling message
    setJsonData({
      vendor_classification: {},
      function_classification: {}
    }); // Clear previous JSON data
    console.log('Form submitted');

    // Basic validation
    if (
      !formData.apiKey ||
      (inputMethod === 'manual' && Object.values(manualInput).some(val => val === '')) ||
      (inputMethod === 'file' && !formData.jsonFile)
    ) {
      console.log('Validation failed: Missing required fields.');
      setStatus('error');
      return;
    }

    try {
      let requestBody = {};

      if (inputMethod === 'file') {
        const fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log('File read successfully');
            try {
              const parsed = JSON.parse(e.target.result);
              resolve(parsed);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = (e) => {
            console.error('File read error:', e);
            reject(e);
          };
          reader.readAsText(formData.jsonFile);
        });
        requestBody = fileContent;
      } else {
        // Generate a random key name
        const randomName = uuidv4();

        // Construct the JSON object
        requestBody = {
          [randomName]: {
            mac_address: manualInput.mac_address,
            oui_vendor: manualInput.oui_vendor,
            'dhcp.option.hostname': manualInput['dhcp.option.hostname']
              ? manualInput['dhcp.option.hostname'].split(',').map(item => item.trim())
              : [],
            'dns.qry.name': manualInput['dns.qry.name']
              ? manualInput['dns.qry.name'].split(',').map(item => item.trim())
              : [],
            'http.user_agent': manualInput['http.user_agent'],
            'dns.ptr.domain_name': manualInput['dns.ptr.domain_name']
              ? manualInput['dns.ptr.domain_name'].split(',').map(item => item.trim())
              : [],
            'dhcp.option.vendor_class_id': manualInput['dhcp.option.vendor_class_id']
              ? manualInput['dhcp.option.vendor_class_id'].split(',').map(item => item.trim())
              : [],
          }
        };
      }

      // Construct authorization header as needed
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': formData.apiKey,
      };

      // Log the request details for debugging
      console.log('API Key:', formData.apiKey);
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(
        'https://qxzcncmpw4.execute-api.eu-west-2.amazonaws.com/test2/classify',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
        }
      );

      console.log('API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response Data:', responseData);

        // Parse the nested body
        const parsedBody = JSON.parse(responseData.body);
        console.log('Parsed Body:', parsedBody);

        if (parsedBody.output_url) {
          console.log('output_url found:', parsedBody.output_url);
          // Start polling with the provided output_url
          startPolling(parsedBody.output_url);
        } else {
          console.log('No output_url found in API response. Setting status to success.');
          setStatus('success');
          setPollingMessage('Request processed, but no output URL was provided.');
        }
      } else {
        console.error('API response not OK. Status:', response.status);
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setStatus('error');
    }
  };

  const startPolling = (url) => {
    const maxAttempts = 15; // For up to 15 minutes with 1-minute intervals
    let attempt = 0;

    setIsPolling(true); // Start polling
    setPollingMessage('Polling for results...');
    console.log('Polling started with URL:', url);

    const pollData = async () => {
      attempt++;
      setPollingMessage(`Polling attempt ${attempt} of ${maxAttempts}...`);
      console.log(`Polling attempt ${attempt} for URL: ${url}`);

      try {
        const linkResponse = await fetch(url);
        console.log('Polling response status:', linkResponse.status);

        if (linkResponse.ok) {
          const linkData = await linkResponse.json(); // Assuming JSON
          console.log('Successfully fetched JSON data:', linkData);
          setJsonData(linkData); // Store fetched JSON data
          setStatus('success');
          setIsPolling(false); // Stop polling
          setPollingMessage('Results fetched successfully!');
        } else if (attempt < maxAttempts) {
          console.warn(`Attempt ${attempt} failed with status ${linkResponse.status}. Retrying in 1 minute.`);
          setTimeout(pollData, 60000); // Retry after 1 minute
        } else {
          console.error(`Failed to fetch data after ${maxAttempts} attempts. Status: ${linkResponse.status}`);
          setStatus('error');
          setIsPolling(false); // Stop polling
          setPollingMessage('Failed to fetch results after multiple attempts.');
        }
      } catch (error) {
        console.error('Error during polling:', error);
        setStatus('error');
        setIsPolling(false); // Stop polling
        setPollingMessage('An error occurred during polling.');
      }
    };

    pollData(); // Initiate the first polling attempt
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 3,
        backgroundColor: 'background.default', // Use theme background
        minHeight: '100vh',
      }}
    >
      <Card sx={{ p: 4, maxWidth: 800, width: '100%', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          NoT Device Classifier
        </Typography>

        {status === 'success' && jsonData.vendor_classification.label && !jsonData.function_classification.label && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your message has been sent successfully!
          </Alert>
        )}
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            There was an error processing your request. Please try again.
          </Alert>
        )}

        {/* Display polling feedback */}
        {isPolling && (
          <Alert severity="info" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
            {pollingMessage}
          </Alert>
        )}

        {/* Display fetched Vendor and Function Classification */}
        {jsonData.vendor_classification.label && jsonData.function_classification.label && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Classification Results:
            </Typography>
            <VendorCard
              vendorClassification={jsonData.vendor_classification}
              functionClassification={jsonData.function_classification}
            />
            {/* Add JustificationCard */}
            {jsonData.function_classification.justification && (
              <JustificationCard justification={jsonData.function_classification.justification} />
            )}
          </Box>
        )}

        <Stack spacing={2}>
          <TextField
            label="API Key"
            name="apiKey"
            type="password"
            value={formData.apiKey}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            color="primary"
          />

          <FormControl component="fieldset">
            <Typography variant="subtitle1">Choose JSON Input Method:</Typography>
            <RadioGroup row value={inputMethod} onChange={handleInputMethodChange}>
              <FormControlLabel
                value="manual"
                control={<Radio color="primary" />}
                label="Enter JSON Manually"
              />
              <FormControlLabel
                value="file"
                control={<Radio color="primary" />}
                label="Upload JSON File"
              />
            </RadioGroup>
          </FormControl>

          {inputMethod === 'manual' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">Vendor Classification:</Typography>
              <TextField
                label="MAC Address"
                name="mac_address"
                value={manualInput.mac_address}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="OUI Vendor"
                name="oui_vendor"
                value={manualInput.oui_vendor}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="DHCP Option Hostname (comma-separated)"
                name="dhcp.option.hostname"
                value={manualInput['dhcp.option.hostname']}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="DNS Query Name (comma-separated)"
                name="dns.qry.name"
                value={manualInput['dns.qry.name']}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="HTTP User Agent"
                name="http.user_agent"
                value={manualInput['http.user_agent']}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="DNS PTR Domain Name (comma-separated)"
                name="dns.ptr.domain_name"
                value={manualInput['dns.ptr.domain_name']}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
              <TextField
                label="DHCP Option Vendor Class ID (comma-separated)"
                name="dhcp.option.vendor_class_id"
                value={manualInput['dhcp.option.vendor_class_id']}
                onChange={handleManualInputChange}
                required
                fullWidth
                variant="outlined"
                color="primary"
              />
            </Box>
          )}

          {inputMethod === 'file' && (
            <Button
              variant="contained"
              component="label"
              startIcon={<InsertDriveFileOutlined />}
            >
              Upload JSON File
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                hidden
              />
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isPolling} // Disable button during polling
          >
            {isPolling ? 'Classifying...' : 'Classify'}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

App.propTypes = {
  // Define PropTypes if necessary
};

export default App;
