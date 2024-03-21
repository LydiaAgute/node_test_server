const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const uploadRoutes = require('./http/upload');
const downloadRoutes = require('./http/download');
const basicRoutes = require('./http/basic');
const setupWebSocket = require('./websocket');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket 服务实例
setupWebSocket(wss);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploadRoutes);
app.use(downloadRoutes);
app.use(basicRoutes);

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
