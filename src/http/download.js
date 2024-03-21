const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

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

module.exports = router;
