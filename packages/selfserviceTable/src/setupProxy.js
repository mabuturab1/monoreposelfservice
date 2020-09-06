const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/vbeta",
    createProxyMiddleware({
      target: "http://35.174.214.251:12123",
      changeOrigin: true,
    })
  );
  app.use(
    "/vbeta/ws",
    createProxyMiddleware({
      target: "http://35.174.214.251:12123",
      changeOrigin: true,
      ws: true,
    })
  );
};
