import express from 'express';
import http from 'http';

import uploadRoutes from './http/upload.js';
import downloadRoutes from './http/download.js';
import basicRoutes from './http/basic.js';
import setupWebSocket from './websocket/index.js';

const app = express();
const server = http.createServer(app);

// WebSocket 服务实例
setupWebSocket(server);

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});

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
