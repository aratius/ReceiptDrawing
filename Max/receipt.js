// Node.js script
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Parse the request
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  // Check if the request is a POST request
  if (req.method == 'POST') {
    let body = '';

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      console.log('POST data:', body);

      // Send a response
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('POST request received');
    });
  } else {
    // If not a POST request, send a response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!');
  }
});

// Listen on port 8000
server.listen(8000, '127.0.0.1', () => {
  console.log('Server is running at http://127.0.0.1:8000/');
});