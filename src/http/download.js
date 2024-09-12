import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  // 使用 process.cwd() 获取当前工作目录
  const filePath = path.join(process.cwd(), 'files', filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        return res.status(404).send('File not found');
      }
      return res.status(500).send(err);
    }

    let { range } = req.headers;

    if (range) {
      // 有 Range 请求头时，解析范围
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      // 设置响应头以支持断点续传
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'application/octet-stream',
      });

      file.pipe(res);
    } else {
      // 没有 Range 请求头时，发送整个文件
      const file = fs.createReadStream(filePath);
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': 'application/octet-stream',
      });
      file.pipe(res);
    }
  });
});

// 测试挂起状态和速度限制的接口
router.get('/slow-download', (req, res) => {
  console.log('slow-download Request Query Parameters:', req.query);
  const speed = parseInt(req.query.speed, 10) || 1; // 读取 speed 参数，默认为 1 字节/秒
  const fileSize = parseInt(req.query.fileSize, 10) || 10 * 1024 * 1024; // 读取 fileSize 参数，默认为 10M
  const buffer = Buffer.alloc(fileSize, 'a'); // 创建一个虚拟文件内容
  let bytesSent = 0; // 已发送字节数
  const totalChunks = buffer.length;

  res.writeHead(200, {
    'Content-Length': totalChunks,
    'Content-Type': 'application/octet-stream',
  });

  // 模拟缓慢发送数据，发送速度为speed
  const interval = setInterval(() => {
    const chunkSize = speed; // 每秒发送的字节数
    const chunk = buffer.subarray(bytesSent, bytesSent + chunkSize); // 从缓冲区中切出一部分
    res.write(chunk); // 将块发送给客户端
    bytesSent += chunkSize;

    // 如果所有数据都发送完了
    if (bytesSent >= totalChunks) {
      clearInterval(interval);
      res.end(); // 结束响应
    }
  }, 1000); // 每秒发送一次数据

  // 如果客户端断开连接，清除定时器
  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;
