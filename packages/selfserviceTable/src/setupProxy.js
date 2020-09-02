const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/vbeta",
    createProxyMiddleware({
      target: "http://35.174.214.251:12123",
      changeOrigin: true,
      ws: true,
    })
  );
  app.use(
    "/ws",
    createProxyMiddleware({
      target: "ws://35.174.214.251:12123/ws",
      changeOrigin: true,
      ws: true,
    })
  );
};
