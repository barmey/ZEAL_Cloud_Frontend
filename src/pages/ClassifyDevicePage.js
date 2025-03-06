// src/pages/ClassifyDevicePage.js

import React, { useState } from 'react';
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
  Link,
  Container,
  IconButton,
  Grid,
} from '@mui/material';
import {
  DeviceHub as DeviceHubIcon,
  VpnKey as VpnKeyIcon,
  Input as InputIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import VendorCard from '../components/VendorCard';
import JustificationCard from '../components/JustificationCard';
import { v4 as uuidv4 } from 'uuid';
import Lottie from 'react-lottie';
import scanningAnimationData from '../animations/scanning.json'; // Ensure this path matches your animation file
import { useNavigate } from 'react-router-dom';

const ClassifyDevicePage = () => {
  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    jsonInput: `{
  "device id": {
    "mac_address": "xx:xx:xx:xx:xx:xx",
    "dhcp.option.hostname": ["hostname1", "hostname2"],
    "dns.qry.name": ["example.com"],
    "http.user_agent": ["UserAgentString"],
    "dns.ptr.domain_name": ["ptr.example.com"],
    "dhcp.option.vendor_class_id": ["class_id"]
  }
}` // Set the initial value to the example JSON
  });
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [inputMethod, setInputMethod] = useState('inference_json'); // 'inference_api', 'inference_json', 'api_usage'
  const [isPolling, setIsPolling] = useState(false); // Indicates if polling is in progress
  const [pollingMessage, setPollingMessage] = useState(''); // Message to display during polling
  const [jsonData, setJsonData] = useState({
    vendor_classification: {},
    function_classification: {},
  }); // Initialize with correct structure
  const [outputUrl, setOutputUrl] = useState(''); // State to store output_url
  const [errorMessage, setErrorMessage] = useState(''); // New state variable for error messages

  // State for manual input fields
  const [manualInput, setManualInput] = useState({
    mac_address: '',
    'dhcp.option.hostname': '',
    'dns.qry.name': '',
    'http.user_agent': '',
    'dns.ptr.domain_name': '',
    'dhcp.option.vendor_class_id': '',
  });

  const navigate = useNavigate();

  // Scanning animation options
  const scanningAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: scanningAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

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
    setFormData({ ...formData, jsonInput: `{
  "device id": {
    "mac_address": "xx:xx:xx:xx:xx:xx",
    "dhcp.option.hostname": ["hostname1", "hostname2"],
    "dns.qry.name": ["example.com"],
    "http.user_agent": ["UserAgentString"],
    "dns.ptr.domain_name": ["ptr.example.com"],
    "dhcp.option.vendor_class_id": ["class_id"]
  }
}` }); // Reset JSON input
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
    setErrorMessage(''); // Reset error message
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
    setErrorMessage(''); // Reset error message
    console.log('Form submitted');

    // Basic validation
    if (!formData.apiKey) {
      console.log('Validation failed: Missing API key.');
      setErrorMessage('API key is required.');
      setStatus('error');
      return;
    }

    try {
      let requestBody = {};

      if (inputMethod === 'inference_json') {
        if (!formData.jsonInput) {
          console.log('Validation failed: JSON input is empty.');
          setErrorMessage('JSON input is required.');
          setStatus('error');
          return;
        }
        try {
          const parsed = JSON.parse(formData.jsonInput);
          requestBody = parsed;
        } catch (err) {
          console.error('JSON parse error:', err);
          setErrorMessage('Invalid JSON input.');
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
          (key) =>
            key !== 'mac_address' &&
            deviceData[key] !== undefined &&
            deviceData[key] !== '' &&
            (Array.isArray(deviceData[key]) ? deviceData[key].length > 0 : true)
        );

        if (fieldsProvided.length === 0) {
          console.log(
            'Validation failed: No data provided in manual input besides MAC address.'
          );
          setErrorMessage('Please provide at least one field besides MAC address.');
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

        // Set error message based on status code
        if (response.status === 401 || response.status === 403) {
          setErrorMessage('Invalid API key. Please check your API key and try again.');
        } else {
          setErrorMessage('An error occurred while processing your request.');
        }
        setStatus('error');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setStatus('error');
    }
  };

  const startPolling = (url) => {
    setIsPolling(true); // Start polling
    setPollingMessage('Waiting for classification process to complete');
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
    <Box sx={{ backgroundColor: '#0D1B2A', color: '#fff', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Heading and Description */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              IoT Device Labeling System
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Our system provides detection of devices, giving you insights into your network. Try it out:
            </Typography>
          </Grid>
        </Grid>
      {/* New Section: Display Device Category if available */}
      {jsonData.mock_data && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#1B263B',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="secondary">
            Device Category: {jsonData.mock_data}
          </Typography>
        </Box>
      )}

        {/* Form and Results */}
        <Box sx={{ mt: 2 }}>
          {status === 'error' && errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: '#1B263B',
              color: '#fff',
            }}
          >
            <Grid container spacing={2}>
              {/* Form Section */}
              <Grid item xs={12} md={6}>
                <form onSubmit={handleSubmit}>
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
                      InputProps={{
                        startAdornment: <VpnKeyIcon color="action" sx={{ mr: 1 }} />,
                        style: { color: '#fff' },
                      }}
                      helperText="To get an API key, please send an email to deepnesslab@tauex.tau.ac.il or click on 'Get Access' above."
                      sx={{ input: { color: '#fff' } }}
                    />

                    <FormControl component="fieldset">
                      <Typography
                        variant="subtitle1"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <InputIcon sx={{ mr: 1 }} /> Choose Input Method:
                      </Typography>
                      <RadioGroup
                        row
                        value={inputMethod}
                        onChange={handleInputMethodChange}
                        sx={{ color: '#fff' }}
                      >
                        <FormControlLabel
                          value="inference_api"
                          control={<Radio color="primary" />}
                          label="API Inference"
                        />
                        <FormControlLabel
                          value="inference_json"
                          control={<Radio color="primary" />}
                          label="JSON Inference"
                        />
                        <FormControlLabel
                          value="api_usage"
                          control={<Radio color="primary" />}
                          label="API FAQ"
                        />
                      </RadioGroup>
                    </FormControl>

                    {inputMethod === 'inference_api' && (
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <DeviceHubIcon sx={{ mr: 1 }} />
                          Device Information:
                        </Typography>
                        {/* Arrange input fields in a grid */}
                        <Grid container spacing={2}>
                          {/* Row 1 */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="MAC Address"
                              name="mac_address"
                              value={manualInput['mac_address']}
                              onChange={handleManualInputChange}
                              helperText="Example: AA:BB:CC:DD:EE:FF"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="HTTP User Agent"
                              name="http.user_agent"
                              value={manualInput['http.user_agent']}
                              onChange={handleManualInputChange}
                              helperText="Example: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                          {/* Row 2 */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="DHCP Hostname (comma-separated)"
                              name="dhcp.option.hostname"
                              value={manualInput['dhcp.option.hostname']}
                              onChange={handleManualInputChange}
                              helperText="Example: host1, host2"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Domains (comma-separated)"
                              name="dns.qry.name"
                              value={manualInput['dns.qry.name']}
                              onChange={handleManualInputChange}
                              helperText="Example: example.com, test.com"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                          {/* Row 3 */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="DNS PTR (comma-separated)"
                              name="dns.ptr.domain_name"
                              value={manualInput['dns.ptr.domain_name']}
                              onChange={handleManualInputChange}
                              helperText="Example: ptr.example.com"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Vendor Class ID (comma-separated)"
                              name="dhcp.option.vendor_class_id"
                              value={manualInput['dhcp.option.vendor_class_id']}
                              onChange={handleManualInputChange}
                              helperText="Example: MSFT 5.0, MSFT 5.1"
                              fullWidth
                              variant="outlined"
                              color="primary"
                              InputProps={{
                                style: { color: '#fff' },
                              }}
                              sx={{ input: { color: '#fff' } }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {inputMethod === 'inference_json' && (
                      <>
                        <Typography
                          variant="subtitle1"
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <InputIcon sx={{ mr: 1 }} />
                          Enter JSON Input:
                        </Typography>
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
                          helperText="Modify the example JSON as needed."
                          InputProps={{
                            style: { color: '#fff', fontFamily: 'monospace' },
                          }}
                          sx={{
                            textarea: { color: '#fff', fontFamily: 'monospace' },
                          }}
                        />
                      </>
                    )}

                    {inputMethod === 'api_usage' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          API Usage Instructions
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          You can use the API directly by making HTTP POST requests to the
                          following endpoint:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <code>
                            https://qxzcncmpw4.execute-api.eu-west-2.amazonaws.com/bar_test_stage/classify
                          </code>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Below is a Python code example using the <code>requests</code>{' '}
                          library:
                        </Typography>
                        <pre
                          style={{
                            backgroundColor: '#415A77',
                            padding: '10px',
                            borderRadius: '8px',
                            overflowX: 'auto',
                            color: '#E0E1DD',
                          }}
                        >
                          {`import requests
import json

url = "https://qxzcncmpw4.execute-api.eu-west-2.amazonaws.com/bar_test_stage/classify"
api_key = "YOUR_API_KEY"

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key
}

data = {
    "device id": {
        "mac_address": "xx:xx:xx:xx:xx:xx",
        "dhcp.option.hostname": ["hostname1", "hostname2"],
        "dns.qry.name": ["example.com"],
        "http.user_agent": "UserAgentString",
        "dns.ptr.domain_name": ["ptr.example.com"],
        "dhcp.option.vendor_class_id": ["class_id"]
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.ok:
    print("Response:", response.json())
else:
    print("Error:", response.text)`}
                        </pre>
                      </Box>
                    )}

                    {inputMethod !== 'api_usage' && (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isPolling}
                        startIcon={<DeviceHubIcon />}
                        sx={{
                          backgroundColor: '#1B9AAA',
                          '&:hover': { backgroundColor: '#128E9E' },
                        }}
                      >
                        {isPolling ? 'Classifying...' : 'Classify'}
                      </Button>
                    )}
                  </Stack>
                </form>
              </Grid>

              {/* Results and Animation Section */}
              <Grid item xs={12} md={6}>
                {/* Display scanning animation when isPolling is true */}
                {isPolling && (
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Lottie options={scanningAnimationOptions} height={200} width={200} />
                    <Typography variant="h6">{pollingMessage}</Typography>
                  </Box>
                )}

                {/* Display fetched Vendor and Function Classification */}
                {status === 'success' &&
                  jsonData.vendor_classification.label &&
                  jsonData.function_classification.label && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Labeling Results:
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
                  <Alert
                    severity="info"
                    sx={{ mt: 2, backgroundColor: '#415A77', color: '#E0E1DD' }}
                  >
                    <Typography variant="subtitle1">
                      When results are ready, you can view them here:
                    </Typography>
                    <Link href={outputUrl} target="_blank" rel="noopener" color="secondary">
                      View Results
                    </Link>
                  </Alert>
                )}

                {/* Display placeholder content when no other content is present */}
                {!isPolling &&
                  status !== 'success' &&
                  !outputUrl &&
                  inputMethod !== 'api_usage' && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 4,
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 80, color: '#1B9AAA' ,mt:16}} />
                      <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                        Ready to classify your IoT device?
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, textAlign: 'center' }}>
                        Enter the device information on the left and click "Classify" to get
                        started.
                      </Typography>
                    </Box>
                  )}
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ClassifyDevicePage;
