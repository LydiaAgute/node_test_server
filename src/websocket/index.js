const WebSocket = require('ws');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
      socket.send(`Server received: ${message}`);
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = setupWebSocket;