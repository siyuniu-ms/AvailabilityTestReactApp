

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/getVersions', async (req, res) => {
  try {
    const response = await fetch('https://github.com/microsoft/ApplicationInsights-JS/blob/main/RELEASES.md');
    
    // Check the content type of the response
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // If the response is JSON, parse it and send as an object
      const data = await response.json();
      res.json(data.versions);
    } else {
      // If the response is not JSON, send it as text
      const data = await response.text();
      res.send(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
