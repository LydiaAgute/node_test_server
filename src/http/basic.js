const express = require('express');

const router = express.Router();

// 处理请求的逻辑保持不变

// 处理 GET 请求的测试接口
router.get('/test-get', (req, res) => {
    console.log('GET Request Query Parameters:', req.query);
    console.log('GET Request Headers:', req.headers);
  
    res.json({
      message: 'GET request handled successfully',
      query: req.query
    });
});
  
// 处理 POST 请求的测试接口
router.post('/test-post', (req, res) => {
    console.log('POST Request Body:', req.body);
    console.log('POST Request Headers:', req.headers);

    const contentType = req.headers['content-type'];
    
	if (contentType.includes('application/json')) {
        // 处理 JSON 类型的请求体
        console.log('Received JSON data:', req.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // 处理 URL 编码的 Form 表单类型的请求体
        console.log('Received URL encoded data:', req.body);
    } else {
        // 处理其他类型
        console.log('Received other type of data');
    }
  
    res.json({
      message: 'POST request handled successfully',
      body: req.body,
    });
});

module.exports = router;