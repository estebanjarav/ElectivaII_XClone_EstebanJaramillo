const app = express();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const PORT = process.env.PORT || 3000;

app.use('/api/v1/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/v1//users', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/api/v1//tweets', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
