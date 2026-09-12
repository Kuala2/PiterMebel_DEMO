// Статический сервер для экспортной сборки (out/).
// Конфиг next.config.ts использует output: "export", поэтому "next start"
// не работает — вместо него запускается: node serve.mjs
import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname, normalize, resolve, sep } from "path";

const ROOT = resolve("out");
const PORT = process.env.PITER_MEBEL_PORT || process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  // Защита от path traversal
  const rel = normalize(pathname).replace(/^[/\\]+/, "");
  let file = resolve(ROOT, rel);
  if (file !== ROOT && !file.startsWith(`${ROOT}${sep}`)) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  }
  // trailingSlash: true → /knowledge → out/knowledge/index.html
  if (!existsSync(file) && !extname(pathname)) {
    file = join(ROOT, rel, "index.html");
  }
  // /page → out/page.html (404 и служебные страницы)
  if (!existsSync(file) && !extname(pathname)) {
    file = join(ROOT, rel + ".html");
  }
  let statusCode = 200;
  if (!existsSync(file)) {
    file = join(ROOT, "404.html");
    statusCode = 404;
  }

  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const body = readFileSync(file);
  res.writeHead(statusCode, {
    "content-type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
    "cache-control": "no-cache",
  });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`Serving out/ at http://localhost:${PORT}`);
});
