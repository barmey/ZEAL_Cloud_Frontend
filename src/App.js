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
  Link,
} from '@mui/material';
import VendorCard from './components/VendorCard';
import JustificationCard from './components/JustificationCard';
import { v4 as uuidv4 } from 'uuid';

Amplify.configure(awsExports);

const App = () => {
  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    jsonInput: '',
  });
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [inputMethod, setInputMethod] = useState('inference_api'); // 'inference_api', 'inference_json', 'api_usage'
  const [isPolling, setIsPolling] = useState(false); // Indicates if polling is in progress
  const [pollingMessage, setPollingMessage] = useState(''); // Message to display during polling
  const [jsonData, setJsonData] = useState({
    vendor_classification: {},
    function_classification: {},
  }); // Initialize with correct structure
  const [outputUrl, setOutputUrl] = useState(''); // State to store output_url

  // State for manual input fields
  const [manualInput, setManualInput] = useState({
    mac_address: '',
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

  const handleJsonInputChange = (e) => {
    setFormData({ ...formData, jsonInput: e.target.value });
  };

  const handleInputMethodChange = (e) => {
    setInputMethod(e.target.value);
    setFormData({ ...formData, jsonInput: '' }); // Reset JSON input
    setManualInput({
      mac_address: '',
      'dhcp.option.hostname': '',
      'dns.qry.name': '',
      'http.user_agent': '',
      'dns.ptr.domain_name': '',
      'dhcp.option.vendor_class_id': '',
    }); // Reset manual input
    setJsonData({
      vendor_classification: {},
      function_classification: {},
    }); // Reset JSON data
    setStatus(null); // Reset status
    setPollingMessage(''); // Reset polling message
    setOutputUrl(''); // Reset output URL
    console.log('Input method changed to:', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null); // Reset status
    setPollingMessage(''); // Reset polling message
    setJsonData({
      vendor_classification: {},
      function_classification: {},
    }); // Clear previous JSON data
    setOutputUrl(''); // Clear output URL
    console.log('Form submitted');

    // Basic validation
    if (!formData.apiKey) {
      console.log('Validation failed: Missing API key.');
      setStatus('error');
      return;
    }

    try {
      let requestBody = {};

      if (inputMethod === 'inference_json') {
        if (!formData.jsonInput) {
          console.log('Validation failed: JSON input is empty.');
          setStatus('error');
          return;
        }
        try {
          const parsed = JSON.parse(formData.jsonInput);
          requestBody = parsed;
        } catch (err) {
          console.error('JSON parse error:', err);
          setStatus('error');
          return;
        }
      } else if (inputMethod === 'inference_api') {
        // Generate a random key name
        const randomName = uuidv4();

        // Construct the JSON object dynamically
        const deviceData = {};

        // Always set mac_address, use fake MAC if empty
        if (manualInput.mac_address) {
          deviceData.mac_address = manualInput.mac_address;
        } else {
          deviceData.mac_address = 'FF:FF:FF:FF:FF:FF';
        }

        if (manualInput['http.user_agent']) {
          deviceData['http.user_agent'] = manualInput['http.user_agent'];
        }
        if (manualInput['dhcp.option.hostname']) {
          deviceData['dhcp.option.hostname'] = manualInput['dhcp.option.hostname']
            .split(',')
            .map((item) => item.trim());
        }
        if (manualInput['dns.qry.name']) {
          deviceData['dns.qry.name'] = manualInput['dns.qry.name']
            .split(',')
            .map((item) => item.trim());
        }
        if (manualInput['dns.ptr.domain_name']) {
          deviceData['dns.ptr.domain_name'] = manualInput['dns.ptr.domain_name']
            .split(',')
            .map((item) => item.trim());
        }
        if (manualInput['dhcp.option.vendor_class_id']) {
          deviceData['dhcp.option.vendor_class_id'] = manualInput[
            'dhcp.option.vendor_class_id'
          ]
            .split(',')
            .map((item) => item.trim());
        }

        // Check if any fields other than mac_address are provided
        const fieldsProvided = Object.keys(deviceData).filter(
          (key) => key !== 'mac_address' && deviceData[key] !== undefined
        );

        if (fieldsProvided.length === 0) {
          console.log(
            'Validation failed: No data provided in manual input besides MAC address.'
          );
          setStatus('error');
          return;
        }

        requestBody = {
          [randomName]: deviceData,
        };
      } else {
        // For 'api_usage', no submission is needed
        return;
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
        'https://qxzcncmpw4.execute-api.eu-west-2.amazonaws.com/bar_test_stage/classify',
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
          // Save the output_url
          setOutputUrl(parsedBody.output_url);
          // Start polling with the provided output_url
          startPolling(parsedBody.output_url);
        } else {
          console.log(
            'No output_url found in API response. Setting status to success.'
          );
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
    setIsPolling(true); // Start polling
    setPollingMessage('Waiting for classification process to end');
    console.log('Polling started with URL:', url);

    const pollData = async () => {
      console.log(`Polling for URL: ${url}`);

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
        } else {
          console.warn(
            `Polling attempt failed with status ${linkResponse.status}. Retrying in 5 seconds.`
          );
          setTimeout(pollData, 5000); // Retry after 5 seconds
        }
      } catch (error) {
        console.error('Error during polling:', error);
        console.warn('Retrying in 5 seconds.');
        setTimeout(pollData, 5000); // Retry after 5 seconds
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
      <Card
        sx={{
          p: 4,
          maxWidth: 800,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          IoT Device Classifier
        </Typography>

        {status === 'success' &&
          jsonData.vendor_classification.label &&
          !jsonData.function_classification.label && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your message has been sent successfully!
            </Alert>
          )}
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            There was an error processing your request. Please ensure you've provided at least one field besides MAC address.
          </Alert>
        )}

        {/* Display polling feedback */}
        {isPolling && (
          <Alert
            severity="info"
            sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
          >
            <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
            {pollingMessage}
          </Alert>
        )}

        {/* Display fetched Vendor and Function Classification */}
        {jsonData.vendor_classification.label &&
          jsonData.function_classification.label && (
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
                <JustificationCard
                  justification={jsonData.function_classification.justification}
                />
              )}
            </Box>
          )}

        {/* Display output_url elegantly */}
        {outputUrl && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              When results are ready, you can view them here:{' '}
            </Typography>
            <Link href={outputUrl} target="_blank" rel="noopener">
              View Results
            </Link>
          </Alert>
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
            <Typography variant="subtitle1">Choose Input Method:</Typography>
            <RadioGroup
              row
              value={inputMethod}
              onChange={handleInputMethodChange}
            >
              <FormControlLabel
                value="inference_api"
                control={<Radio color="primary" />}
                label="Inference API"
              />
              <FormControlLabel
                value="inference_json"
                control={<Radio color="primary" />}
                label="Inference JSON"
              />
              <FormControlLabel
                value="api_usage"
                control={<Radio color="primary" />}
                label="API Usage Instructions"
              />
            </RadioGroup>
          </FormControl>

          {inputMethod === 'inference_api' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">Device Information:</Typography>
              {/* [Manual input fields here, same as before] */}
              {/* ... */}
            </Box>
          )}

          {inputMethod === 'inference_json' && (
            <>
              <Typography variant="subtitle1">Paste JSON Here:</Typography>
              {/* Display the JSON example */}
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  overflowX: 'auto',
                  marginBottom: '16px',
                }}
              >
{`{
  "device id": {
    "mac_address": "xx:xx:xx:xx:xx:xx",
    "dhcp.option.hostname": ["hostname1", "hostname2"],
    "dns.qry.name": ["example.com"],
    "http.user_agent": "UserAgentString",
    "dns.ptr.domain_name": ["ptr.example.com"],
    "dhcp.option.vendor_class_id": ["class_id"]
  }
}`}
              </pre>
              <TextField
                label="JSON Input"
                name="jsonInput"
                value={formData.jsonInput}
                onChange={handleJsonInputChange}
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                color="primary"
                placeholder={`{
  "device id": {
    "mac_address": "xx:xx:xx:xx:xx:xx",
    "dhcp.option.hostname": ["hostname1", "hostname2"],
    "dns.qry.name": ["example.com"],
    "http.user_agent": "UserAgentString",
    "dns.ptr.domain_name": ["ptr.example.com"],
    "dhcp.option.vendor_class_id": ["class_id"]
  }
}`}
                helperText="Example JSON structure is shown in the placeholder above."
              />
            </>
          )}

          {inputMethod === 'api_usage' && (
            <Box sx={{ mt: 2 }}>
              {/* [API Usage Instructions here, same as before] */}
              {/* ... */}
            </Box>
          )}

          {inputMethod !== 'api_usage' && (
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
          )}
        </Stack>
      </Card>
    </Box>
  );
};

App.propTypes = {
  // Define PropTypes if necessary
};

export default App;
