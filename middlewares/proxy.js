const http = require("http");
const httpProxy = require("http-proxy");

const feOrigin =
  process.env.NODE_ENV === "PRD"
    ? process.env.FE_ORIGIN
    : process.env.FE_STG_ORIGIN;
const beOrigin =
  process.env.NODE_ENV === "PRD"
    ? process.env.BE_ORIGIN
    : process.env.BE_STG_ORIGIN;

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});

module.exports = (req, res) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);

  if (req.originalUrl.startsWith("/api")) {
    proxy.web(req, res, { target: beOrigin }, (err) => {
      if (err) {
        console.error("Backend proxy error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Something went wrong with the backend proxy.");
      } else {
        console.log(`Proxied to backend: ${req.method} ${req.originalUrl}`);
      }
    });
  } else {
    proxy.web(req, res, { target: feOrigin }, (err) => {
      if (err) {
        console.error("Frontend proxy error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Something went wrong with the frontend proxy.");
      } else {
        console.log(`Proxied to frontend: ${req.method} ${req.originalUrl}`);
      }
    });
  }
};
