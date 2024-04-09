import express from 'express';

const router = express.Router();

// 处理 GET 请求的测试接口
router.get('/test-get', (req, res) => {
  console.log('GET Request Query Parameters:', req.query);
  console.log('GET Request Headers:', req.headers);

  res.json({
    message: 'GET request handled successfully',
    query: req.query,
  });
});

router.get('/test-redirect', (req, res) => {
  // 使用 302 临时重定向
  res.redirect(302, 'test-get');

  // 如果你想要使用 301 永久重定向，可以这样写：
  // res.redirect(301, 'test-get');
});

// 模拟长阻塞后响应的接口
router.get('/long-response', (req, res) => {
  console.log('long-response Request Query Parameters:', req.query);
  console.log('long-response Request Headers:', req.headers);
  // 模拟长阻塞，延迟5秒钟
  setTimeout(() => {
    res.send('This is a response after 10 second blocking.');
  }, 10000);
});

// 模拟长阻塞后无响应的接口
router.get('/no-response', (req, res) => {
  console.log('no-response Request Query Parameters:', req.query);
  console.log('no-response Request Headers:', req.headers);
  // 模拟长阻塞，不发送任何响应
  setTimeout(() => {
    // 这里不发送任何响应，模拟长阻塞后无响应
  }, 10000);
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

// 处理 PUT 请求的测试接口
router.put('/test-put', (req, res) => {
  console.log('PUT Request Body:', req.body);
  console.log('PUT Request Headers:', req.headers);

  const contentType = req.headers['content-type'];

  if (contentType && contentType.includes('application/json')) {
    // 处理 JSON 类型的请求体
    console.log('Received JSON data:', req.body);
  } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
    // 处理 URL 编码的 Form 表单类型的请求体
    console.log('Received URL encoded data:', req.body);
  } else {
    // 处理其他类型
    console.log('Received other type of data');
  }

  res.json({
    message: 'PUT request handled successfully',
    body: req.body,
  });
});

// 处理 PATCH 请求的测试接口
router.patch('/test-patch', (req, res) => {
  console.log('PATCH Request Body:', req.body);
  console.log('PATCH Request Headers:', req.headers);

  const contentType = req.headers['content-type'];

  if (contentType && contentType.includes('application/json')) {
    // 处理 JSON 类型的请求体
    console.log('Received JSON data:', req.body);
  } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
    // 处理 URL 编码的 Form 表单类型的请求体
    console.log('Received URL encoded data:', req.body);
  } else {
    // 处理其他类型
    console.log('Received other type of data');
  }

  res.json({
    message: 'PATCH request handled successfully',
    body: req.body,
  });
});

export default router;
