// Static file handler: gzip for text, ETag and 304, no escape from the public folder.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");
const { createStatic } = require("../static");

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".ogg": "audio/ogg" };

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "static-"));
  fs.writeFileSync(path.join(dir, "index.html"), "<p>xin chào</p>");
  fs.writeFileSync(path.join(dir, "big.js"), "// đêm\n".repeat(400));
  fs.writeFileSync(path.join(dir, "a.ogg"), Buffer.alloc(4000, 7));
  fs.writeFileSync(path.join(dir, "..", path.basename(dir) + "-secret.txt"), "no");
  return { dir, serve: createStatic(dir, MIME) };
}

function get(serve, pathname, headers = {}) {
  return new Promise((resolve) => {
    const res = {
      status: 0, headers: {}, body: null,
      writeHead(status, h) { this.status = status; this.headers = h || {}; },
      end(body) { this.body = body == null ? null : Buffer.from(body); resolve(this); },
    };
    serve({ headers }, res, new URL("http://x" + pathname));
  });
}

test("the root path serves index.html with an ETag and no-cache", async () => {
  const { serve } = setup();
  const r = await get(serve, "/");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.headers["Content-Type"], MIME[".html"]);
  assert.strictEqual(r.headers["Cache-Control"], "no-cache");
  assert.match(r.headers.ETag, /^".+"$/);
  assert.strictEqual(r.body.toString(), "<p>xin chào</p>");
});

test("a large text file is gzipped only for a client that accepts gzip", async () => {
  const { dir, serve } = setup();
  const plain = await get(serve, "/big.js");
  assert.strictEqual(plain.headers["Content-Encoding"], undefined);
  assert.strictEqual(plain.headers.Vary, "Accept-Encoding");
  const gz = await get(serve, "/big.js", { "accept-encoding": "gzip, deflate, br" });
  assert.strictEqual(gz.headers["Content-Encoding"], "gzip");
  assert.ok(gz.body.length < plain.body.length);
  assert.strictEqual(gz.headers["Content-Length"], gz.body.length);
  assert.deepStrictEqual(zlib.gunzipSync(gz.body), fs.readFileSync(path.join(dir, "big.js")));
});

test("small text and audio are sent as they are", async () => {
  const { serve } = setup();
  const h = { "accept-encoding": "gzip" };
  assert.strictEqual((await get(serve, "/index.html", h)).headers["Content-Encoding"], undefined);
  const ogg = await get(serve, "/a.ogg", h);
  assert.strictEqual(ogg.headers["Content-Encoding"], undefined);
  assert.strictEqual(ogg.body.length, 4000);
});

test("a matching If-None-Match answers 304 with no body", async () => {
  const { serve } = setup();
  const first = await get(serve, "/big.js");
  const again = await get(serve, "/big.js", { "if-none-match": first.headers.ETag });
  assert.strictEqual(again.status, 304);
  assert.strictEqual(again.body, null);
});

test("a changed file gets a new ETag and the new content", async () => {
  const { dir, serve } = setup();
  const first = await get(serve, "/index.html");
  fs.writeFileSync(path.join(dir, "index.html"), "<p>bản mới, dài hơn</p>");
  const second = await get(serve, "/index.html", { "if-none-match": first.headers.ETag });
  assert.strictEqual(second.status, 200);
  assert.notStrictEqual(second.headers.ETag, first.headers.ETag);
  assert.strictEqual(second.body.toString(), "<p>bản mới, dài hơn</p>");
});

test("missing files and folders answer 404; paths outside the folder are refused", async () => {
  const { dir, serve } = setup();
  assert.strictEqual((await get(serve, "/nope.js")).status, 404);
  fs.mkdirSync(path.join(dir, "sub"));
  assert.strictEqual((await get(serve, "/sub")).status, 404);
  const out = await get(serve, "/%2e%2e/" + path.basename(dir) + "-secret.txt");
  assert.ok(out.status === 403 || out.status === 404);
  assert.notStrictEqual(out.body && out.body.toString(), "no");
});
