const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { makeSandbox, load } = require("./client-harness");

const ROLES = () => JSON.parse(JSON.stringify(load(makeSandbox(), "story.js").ROLE_INFO));

test("role cards describe a way of playing, never a fixed story person", () => {
  const roles = ROLES();
  assert.deepEqual(Object.keys(roles).sort(), ["ghost", "monk", "villager"]);
  for (const [k, r] of Object.entries(roles)) {
    assert.ok(r.name && r.tagline && r.blurb && r.meter, k);
    assert.equal("who" in r, false, `${k} no longer carries a fixed person`);
    const all = [r.name, r.tagline, r.blurb].join(" ");
    assert.equal(/Thầy Tịnh|Sư Tịnh|Ông Tư|Bà Sáu|Hạnh|bán xôi/.test(all), false, `${k} mentions an NPC`);
  }
});

test("the picker shows the tagline, not a person", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
  assert.ok(app.includes('el("div", "rc-who", info.tagline)'));
  assert.equal(app.includes("info.who"), false);
});
