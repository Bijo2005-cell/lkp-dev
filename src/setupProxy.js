const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Event details: /api/events/* → http://62.72.12.51:8080/api/events/* (must be before /api)
  app.use(
    '/api/events',
    createProxyMiddleware({
      target: 'http://62.72.12.51:8080/',
      changeOrigin: true,
      secure: false,
      // When mounting a proxy on '/api/events', http-proxy-middleware forwards only
      // the remaining path (e.g. '/7/public'). The backend expects '/api/events/7/public'.
      pathRewrite: (path) => `/api/events${path}`,
      logLevel: 'debug',
      proxyTimeout: 60000,
      timeout: 60000,
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy Events]', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[Proxy Events Response]', req.url, '->', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Events Error]', err.message);
        res.status(500).send('Proxy error: ' + err.message);
      }
    })
  );

  // All other /api → http://62.72.12.51:6000/
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

