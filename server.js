const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, "index.html")) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    const range = request.headers.range;
    if (!range) {
      response.writeHead(200, { "Content-Type": contentType, "Content-Length": stats.size, "Accept-Ranges": "bytes" });
      fs.createReadStream(filePath).pipe(response);
      return;
    }

    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!match) {
      response.writeHead(416, { "Content-Range": `bytes */${stats.size}` }).end();
      return;
    }

    let start = Number(match[1] || 0);
    let end = match[2] ? Number(match[2]) : stats.size - 1;
    if (!match[1] && match[2]) {
      start = Math.max(stats.size - end, 0);
      end = stats.size - 1;
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stats.size) {
      response.writeHead(416, { "Content-Range": `bytes */${stats.size}` }).end();
      return;
    }

    end = Math.min(end, stats.size - 1);
    response.writeHead(206, {
      "Content-Type": contentType,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stats.size}`,
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath, { start, end }).pipe(response);
  });
}).listen(5173, "127.0.0.1", () => {
  console.log("Birthday scrapbook available at http://localhost:5173");
});
