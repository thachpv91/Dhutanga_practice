// Static files for the client: gzip for text, an ETag so a second visit answers 304, and a small in-memory cache.
// "Cache-Control: no-cache" makes the browser ask each time, so a new deploy is seen at once and nothing stale is kept.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const TEXT = new Set([".html", ".js", ".css", ".json", ".svg"]);
const MIN_GZIP = 1024; // smaller files gain nothing

function createStatic(dir, mime) {
  const root = path.resolve(dir);
  const cache = new Map(); // file -> { mtimeMs, size, body, gz, etag }

  function load(file, stat, cb) {
    const hit = cache.get(file);
    if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return cb(null, hit);
    fs.readFile(file, (err, body) => {
      if (err) return cb(err);
      const entry = {
        mtimeMs: stat.mtimeMs, size: stat.size, body,
        etag: `"${crypto.createHash("sha1").update(body).digest("base64url")}"`,
        gz: TEXT.has(path.extname(file)) && body.length >= MIN_GZIP ? zlib.gzipSync(body) : null,
      };
      cache.set(file, entry);
      cb(null, entry);
    });
  }

  const notFound = (res) => { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("Không tìm thấy"); };

  return function serveStatic(req, res, url) {
    const rel = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const file = path.normalize(path.join(root, rel));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) return notFound(res);
      load(file, stat, (err2, entry) => {
        if (err2) return notFound(res);
        const headers = {
          "Content-Type": mime[path.extname(file)] || "application/octet-stream",
          "Cache-Control": "no-cache",
          ETag: entry.etag,
        };
        if (entry.gz) headers.Vary = "Accept-Encoding";
        if (req.headers["if-none-match"] === entry.etag) { res.writeHead(304, headers); return res.end(); }
        const gzip = entry.gz && /\bgzip\b/.test(String(req.headers["accept-encoding"] || ""));
        const body = gzip ? entry.gz : entry.body;
        if (gzip) headers["Content-Encoding"] = "gzip";
        headers["Content-Length"] = body.length;
        res.writeHead(200, headers);
        res.end(body);
      });
    });
  };
}

module.exports = { createStatic };
