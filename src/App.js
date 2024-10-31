// src/App.js
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './App.css'; // Ensure that the CSS file is imported
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
  AppBar,
  Toolbar,
  Container,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  DeviceHub as DeviceHubIcon,
  VpnKey as VpnKeyIcon,
  Input as InputIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import VendorCard from './components/VendorCard';
import JustificationCard from './components/JustificationCard';
import { v4 as uuidv4 } from 'uuid';
import mainImage from './components/main_image.png'; // Import the main image

Amplify.configure(awsExports);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

const App = () => {
  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    jsonInput: '',
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
    <ThemeProvider theme={theme}>
      <div className="app-background">
        {/* Apply the background image class */}
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <DeviceHubIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IoT Device Classifier
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          {/* Moved About Us and Academic Use sections to the top */}
          <Box
            sx={{ width: '100%', mt: 4 }}
            className="dark-bold-blue-text" // Apply the dark bold blue text class
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <InfoIcon sx={{ mr: 1 }} />
              About Us
            </Typography>
            <Typography variant="body1" gutterBottom>
              We at the research group <strong>Deepness Lab</strong> developed a labeling
              system for unseen IoT devices. We aim to provide visibility to the devices
              connected to your networks and reveal both the vendor (e.g., Nest, Ring) and
              function (e.g., speaker, camera, vacuum cleaner). We address the challenge
              of type labeling of an unseen IoT device. We introduce a novel IoT labeling
              system, Zero-shot Engine for IoT Asset Labeling (ZEAL).
              <br />
              To use this cloud-based system, you can reach out to us at{' '}
              <Link href="mailto:deepnesslab@tauex.tau.ac.il">
                deepnesslab@tauex.tau.ac.il
              </Link>{' '}
              to get access (API key) to the system. For more information and research,
              visit our website:{' '}
              <Link
                href="https://deepness-lab.org/publications/"
                target="_blank"
                rel="noopener"
              >
                https://deepness-lab.org/publications/
              </Link>
            </Typography>

            <Typography
              variant="h6"
              gutterBottom
              sx={{ mt: 4, display: 'flex', alignItems: 'center' }}
            >
              <SchoolIcon sx={{ mr: 1 }} />
              Academic Use
            </Typography>
            <Typography variant="body1" gutterBottom>
              Any use of the system for academic research is encouraged. We kindly ask you
              to cite our paper:
            </Typography>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '8px',
                overflowX: 'auto',
                color: '#333',
              }}
            >
              {`@misc{Bremler-Barr2024b,
  author = {Anat Bremler-Barr and Bar Meyuhas and Tal Shapira},
  title = {IoT Device Labeling Using Large Language Models},
  year = {2024},
  url = {https://deepness-lab.org/publications/iot-device-labeling-using-large-language-models/},
}`}
            </pre>
          </Box>

          {/* The form starts here */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'background.default',
              mt: 4, // Add margin top to separate from the above sections
            }}
          >
            <Card
              sx={{
                p: 4,
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              {status === 'success' &&
                jsonData.vendor_classification.label &&
                !jsonData.function_classification.label && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Your message has been sent successfully!
                  </Alert>
                )}
              {status === 'error' && errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
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
                  InputProps={{
                    startAdornment: <VpnKeyIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  helperText="To get an API key, please send an email to deepnesslab@tauex.tau.ac.il."
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
                    <Typography
                      variant="subtitle1"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <DeviceHubIcon sx={{ mr: 1 }} />
                      Device Information:
                    </Typography>
                    {/* Manual input fields with specific helperText */}
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
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
                        startAdornment: (
                          <IconButton edge="start" disabled>
                            <InputIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                )}

                {inputMethod === 'inference_json' && (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <InputIcon sx={{ mr: 1 }} />
                      Paste JSON Here:
                    </Typography>
                    {/* Display the JSON example */}
                    <pre
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '8px',
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
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '8px',
                        overflowX: 'auto',
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
                  >
                    {isPolling ? 'Classifying...' : 'Classify'}
                  </Button>
                )}
              </Stack>
            </Card>

            {/* Footer with copyright */}
            <Box
              sx={{
                mt: 4,
                py: 2,
                width: '100%',
                backgroundColor: 'background.paper',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Bar Meyuhas, Anat Bremler Barr, and Tal
                Shapira
              </Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton
                  component="a"
                  href="https://github.com/barmey/NSDI_Labeling_system"
                  target="_blank"
                  rel="noopener"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://scholar.google.com/citations?user=xeWZouIAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener"
                >
                  <SchoolIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

App.propTypes = {
  // Define PropTypes if necessary
};

export default App;
