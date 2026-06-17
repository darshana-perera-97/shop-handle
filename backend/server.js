const http = require("http");

const PORT = 2223;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Server is running" }));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
