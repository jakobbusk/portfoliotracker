import http from 'http';
import app from './app.js';

// Set up a simple HTTP server
const server = http.createServer(app);
// Start the server and listen on the specified port
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
