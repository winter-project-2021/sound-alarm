const { createProxyMiddleware } = require('http-proxy-middleware');
const END_POINT = `${process.env.END_POINT}`;

module.exports = function (app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: `${END_POINT}`,
      changeOrigin: true
    })
  );

  app.use(
    '/audio',
    createProxyMiddleware({
      target: `${END_POINT}/audio`,
      changeOrigin: true
    })
  );

  app.use(
    '/text',
    createProxyMiddleware({
      target: `${END_POINT}/text`,
      changeOrigin: true
    })
  );
};