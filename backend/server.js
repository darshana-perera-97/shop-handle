require("dotenv").config();

const fs = require("fs/promises");
const fsSync = require("fs");
const http = require("http");
const crypto = require("crypto");
const path = require("path");
const { readCollection, writeCollection, isValidCollection } = require("./lib/jsonStore");

const PORT = process.env.PORT || 2223;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SHOP_NAME = process.env.SHOP_NAME || "Shop Handle";
const SHOP_CITY = process.env.SHOP_CITY || "";
const SHOP_SHORT_NAME = process.env.SHOP_SHORT_NAME || "SH";
const FRONTEND_BUILD = path.join(__dirname, "..", "frontend", "build");
const FRONTEND_BUILD_ROOT = path.resolve(FRONTEND_BUILD);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const sessions = new Map();

function createToken(username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  return token;
}

function getSession(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) || null;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(payload == null ? "" : JSON.stringify(payload));
}

function sendFile(res, statusCode, filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(statusCode, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
  });
  res.end(content);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function resolveFrontendPath(requestPath) {
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = path.resolve(FRONTEND_BUILD, relativePath);

  if (!filePath.startsWith(FRONTEND_BUILD_ROOT)) {
    return null;
  }

  return filePath;
}

async function serveFrontend(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!fsSync.existsSync(FRONTEND_BUILD)) {
    sendJson(res, 503, {
      error: "Frontend build not found. Run: npm run build --prefix frontend",
    });
    return;
  }

  const filePath = resolveFrontendPath(url.pathname);
  if (!filePath) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    let resolvedPath = filePath;
    const stat = await fs.stat(resolvedPath);

    if (stat.isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
    }

    if (req.method === "HEAD") {
      sendFile(res, 200, resolvedPath, "");
      return;
    }

    const content = await fs.readFile(resolvedPath);
    sendFile(res, 200, resolvedPath, content);
  } catch {
    const indexPath = path.join(FRONTEND_BUILD, "index.html");
    const content = await fs.readFile(indexPath);
    sendFile(res, 200, indexPath, content);
  }
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/shop" && req.method === "GET") {
    sendJson(res, 200, {
      name: SHOP_NAME,
      city: SHOP_CITY,
      shortName: SHOP_SHORT_NAME,
    });
    return;
  }

  if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const { username, password } = (await parseBody(req)) || {};

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sendJson(res, 200, { token: createToken(username), username });
        return;
      }

      sendJson(res, 401, { error: "Invalid username or password" });
    } catch {
      sendJson(res, 400, { error: "Invalid request body" });
    }
    return;
  }

  if (url.pathname === "/api/logout" && req.method === "POST") {
    const session = getSession(req);
    if (session) {
      const auth = req.headers.authorization || "";
      sessions.delete(auth.slice(7));
    }
    sendJson(res, 200, { message: "Logged out" });
    return;
  }

  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    const session = getSession(req);
    if (!session) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }
    sendJson(res, 200, { username: session.username });
    return;
  }

  if (!getSession(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return;
  }

  const match = url.pathname.match(/^\/api\/([a-zA-Z]+)$/);
  if (!match) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const collection = match[1];

  if (!isValidCollection(collection)) {
    sendJson(res, 404, { error: `Unknown collection: ${collection}` });
    return;
  }

  try {
    if (req.method === "GET") {
      const data = await readCollection(collection);
      sendJson(res, 200, data);
      return;
    }

    if (req.method === "PUT") {
      const data = await parseBody(req);

      if (!Array.isArray(data)) {
        sendJson(res, 400, { error: "Request body must be a JSON array" });
        return;
      }

      await writeCollection(collection, data);
      sendJson(res, 200, data);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error" });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, null);
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname.startsWith("/api")) {
    await handleApi(req, res, url);
    return;
  }

  await serveFrontend(req, res, url);
});

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in backend/.env");
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  if (fsSync.existsSync(FRONTEND_BUILD)) {
    console.log(`Serving frontend from ${FRONTEND_BUILD}`);
  } else {
    console.warn(
      "Frontend build not found. Build it with: npm run build --prefix frontend",
    );
  }
});
