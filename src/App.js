// src/App.js
import React from 'react';
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
import theme from './theme'; // Optional: if you need to access theme in App.js

Amplify.configure(awsExports);

const App = () => {
  // Form state
  const [formData, setFormData] = React.useState({
    apiKey: '',
    jsonInput: '',
    jsonFile: null,
  });
  const [status, setStatus] = React.useState(null); // null, 'success', 'error'
  const [inputMethod, setInputMethod] = React.useState('file'); // 'file' or 'manual'
  const [isPolling, setIsPolling] = React.useState(false); // Indicates if polling is in progress
  const [pollingMessage, setPollingMessage] = React.useState(''); // Message to display during polling
  const [jsonData, setJsonData] = React.useState(null); // Stores fetched JSON data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setFormData({ ...formData, jsonInput: '', jsonFile: null }); // Reset JSON input
    setJsonData(null); // Clear previously fetched JSON data
    setStatus(null); // Reset status
    console.log('Input method changed to:', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null); // Reset status
    setPollingMessage(''); // Reset polling message
    setJsonData(null); // Clear previous JSON data
    console.log('Form submitted');

    // Basic validation
    if (
      !formData.apiKey ||
      (inputMethod === 'manual' && !formData.jsonInput) ||
      (inputMethod === 'file' && !formData.jsonFile)
    ) {
      console.log('Validation failed: Missing required fields.');
      setStatus('error');
      return;
    }

    try {
      let requestBody = '';

      if (inputMethod === 'file') {
        requestBody = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log('File read successfully');
            resolve(e.target.result);
          };
          reader.onerror = (e) => {
            console.error('File read error:', e);
            reject(e);
          };
          reader.readAsText(formData.jsonFile);
        });
      } else {
        requestBody = formData.jsonInput;
        console.log('Manual JSON input:', requestBody);
      }

      // Construct authorization header as needed
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': formData.apiKey,
      };

      // Log the request details for debugging
      console.log('API Key:', formData.apiKey);
      console.log('Request Body:', requestBody);

      const response = await fetch(
        'https://qxzcncmpw4.execute-api.eu-west-2.amazonaws.com/test2/classify',
        {
          method: 'POST',
          headers: headers,
          body: requestBody,
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
      <Card sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          NoT Device Classifier
        </Typography>

        {status === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {jsonData
              ? 'JSON data fetched successfully!'
              : 'Your message has been sent successfully!'}
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

        {/* Display fetched JSON data */}
        {jsonData && (
          <Alert severity="success" sx={{ mb: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <Typography variant="subtitle1" gutterBottom>
              Fetched JSON Data:
            </Typography>
            <Typography variant="body2">
              {JSON.stringify(jsonData, null, 2)}
            </Typography>
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="API Key"
            name="apiKey"
            type = "password"
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
                value="file"
                control={<Radio color="primary" />}
                label="Upload JSON File"
              />
              <FormControlLabel
                value="manual"
                control={<Radio color="primary" />}
                label="Enter JSON Manually"
              />
            </RadioGroup>
          </FormControl>

          {inputMethod === 'file' && (
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ margin: '1rem 0' }}
            />
          )}

          {inputMethod === 'manual' && (
            <TextField
              label="JSON Input"
              name="jsonInput"
              value={formData.jsonInput}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              color="primary"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isPolling} // Disable button during polling
          >
            {isPolling ? 'Submitting...' : 'Submit'}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default App;
