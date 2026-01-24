const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://62.72.12.51:6000/',
      changeOrigin: true,
      secure: false,
      pathRewrite: (path, req) => `/api${path}`,
      logLevel: 'debug',
      proxyTimeout: 60000,
      timeout: 60000,
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy]', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[Proxy Response]', req.url, '->', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Error]', err.message);
        res.status(500).send('Proxy error: ' + err.message);
      }
    })
  );
};

