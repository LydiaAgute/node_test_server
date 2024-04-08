import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// 设置 Multer 中间件
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// 文件上传接口
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

// 流式文件上传接口
router.post('/stream-upload', (req, res) => {
  const filename = req.headers['x-filename'];
  if (!filename) {
    return res.status(400).send('Filename is required');
  }

  // 使用 process.cwd() 获取当前工作目录
  const targetPath = path.join(process.cwd(), 'file', filename);
  const writeStream = fs.createWriteStream(targetPath);

  req.pipe(writeStream);

  req.on('end', () => {
    res.json({ message: 'File streamed and uploaded successfully' });
  });

  req.on('error', (err) => {
    console.log('Error during file streaming', err);
    res.status(500).send('Error during file streaming');
  });

  writeStream.on('error', (err) => {
    console.log('Error writing file', err);
    res.status(500).send('Error writing file');
  });
});

export default router;
