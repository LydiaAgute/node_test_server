const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 上传下载逻辑保持不变
// 设置 Multer 中间件
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

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

    const targetPath = path.join(__dirname, 'uploads', filename);
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

module.exports = router;