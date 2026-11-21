const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const Z = () => load(makeSandbox(), "zones.js").Zones;
const ID = "hang_vong_tam";
const none = { hasItem: () => false, hasStory: () => false };
const withItems = (...ids) => ({ hasItem: (i) => ids.includes(i), hasStory: () => false });
// values made inside the vm sandbox have other prototypes, so compare through JSON
const plain = (v) => JSON.parse(JSON.stringify(v));

// every node reachable from the entry with the given ctx
function reach(K, ctx) {
  const seen = new Set([K.zone(ID).entry]), q = [...seen];
  while (q.length) for (const nb of K.neighbors(ID, q.shift(), ctx)) if (!seen.has(nb.node)) { seen.add(nb.node); q.push(nb.node); }
  return seen;
}

test("graph is connected and edges point at real nodes", () => {
  const K = Z(), z = K.zone(ID);
  for (const e of z.edges) assert.ok(z.nodes[e.a] && z.nodes[e.b], e.a + "-" + e.b);
  assert.equal(reach(K, withItems("den_nho")).size, Object.keys(z.nodes).length);
});

test("every node reaches cua without being blocked by a gate", () => {
  const K = Z(), z = K.zone(ID);
  for (const id of Object.keys(z.nodes)) {
    // going back is never blocked, so even nodes behind a gate walk out with nothing held
    const r = K.route(ID, id, z.entry, none);
    assert.ok(r, id + " has no way back");
    assert.equal(r[r.length - 1], z.entry);
  }
  // nodes in front of the gate are reachable from cua with nothing held
  const open = reach(K, none);
  for (const id of ["cua", "sanh", "ho", "hoc", "vach", "dai", "khe_sang"]) assert.ok(open.has(id), id);
});

test("at least two independent loops without gates; loop A and loop B exist", () => {
  const K = Z();
  assert.ok(K.cycles(ID) >= 2);
  const has = (a, b) => K.neighbors(ID, a, none).some((n) => n.node === b);
  // loop A: sanh-ho-hoc-sanh
  assert.ok(has("sanh", "ho") && has("ho", "hoc") && has("hoc", "sanh"));
  // loop B: sanh-ho-dai-vach-hoc-sanh
  assert.ok(has("ho", "dai") && has("dai", "vach") && has("vach", "hoc"));
});

test("hub has at least three neighbours besides the entry, including a way straight up to Vách Khắc", () => {
  const K = Z(), z = K.zone(ID);
  const others = K.neighbors(ID, z.hub, none).map((n) => n.node).filter((n) => n !== z.entry);
  assert.ok(others.length >= 3);
  for (const n of ["ho", "hoc", "vach"]) assert.ok(others.includes(n), n);
});

test("landmarks: some are pure viewing, some write a discovery, looks are short", () => {
  const z = Z().zone(ID);
  assert.ok(z.landmarks.filter((l) => !l.story).length >= 2);
  const discs = z.landmarks.filter((l) => l.disc).map((l) => l.disc);
  for (const d of ["hang_ho", "hang_vach", "hang_hoc_tru"]) assert.ok(discs.includes(d), d);
  for (const l of z.landmarks) {
    assert.ok(z.nodes[l.node], l.id);
    assert.ok(l.look.split("\n").length <= 3, l.id);
  }
});

test("every gate's near node is reachable without gates (preview)", () => {
  const K = Z(), z = K.zone(ID);
  const open = reach(K, none);
  for (const [gid, g] of Object.entries(z.gates)) {
    assert.equal(g.previewOpen, true);
    assert.ok(open.has(g.near), gid);
    assert.ok(z.edges.some((e) => e.gate === gid && e.a === g.near), gid);
  }
});

test("at least one exit is not at the entry node", () => {
  const z = Z().zone(ID);
  assert.ok(z.exits.some((x) => x.at !== z.entry));
  for (const x of z.exits) assert.ok(z.nodes[x.at]);
});

test("ids are unique and the data is frozen", () => {
  const K = Z(), z = K.zone(ID);
  const lm = z.landmarks.map((l) => l.id);
  assert.equal(new Set(lm).size, lm.length);
  const ek = z.edges.map((e) => e.a + "-" + e.b);
  assert.equal(new Set(ek).size, ek.length);
  assert.ok(Object.isFrozen(z) && Object.isFrozen(z.nodes.cua) && Object.isFrozen(z.edges));
  assert.equal(K.zone("nope"), null);
});

test("route avoids a closed gate and uses it when the player holds a light", () => {
  const K = Z();
  assert.equal(K.route(ID, "cua", "nguong", none), null);
  assert.equal(K.route(ID, "cua", "nguong", withItems("pho_bien")), null);
  for (const item of ["den_nho", "den_dau"]) {
    const r = K.route(ID, "cua", "nguong", withItems(item));
    assert.ok(r && r.includes("dai") && r.includes("hanh_lang") && r[r.length - 1] === "nguong", item);
  }
  const story = { hasItem: () => false, hasStory: (s) => s === "guide_cave" };
  assert.ok(K.route(ID, "cua", "nguong", story));
});

test("the light gate closes again when the item is gone (passing is not saved)", () => {
  const K = Z(), S = {};
  const held = new Set(["den_nho"]);
  const ctx = { hasItem: (i) => held.has(i), hasStory: () => false };
  assert.ok(K.route(ID, "dai", "hanh_lang", ctx));
  assert.equal(K.markGate(S, "hang.light", 5), true);        // seeing the gate is saved
  held.delete("den_nho");
  assert.equal(K.route(ID, "dai", "hanh_lang", ctx), null);  // passing is not
  assert.ok(K.route(ID, "hanh_lang", "dai", ctx));           // walking back out is always fine
});

test("nearestWalkable always lands inside the walkable area", () => {
  const K = Z(), z = K.zone(ID);
  let seed = 12345;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const samples = [];
  for (let i = 0; i < 600; i++) samples.push([rnd() * 400, rnd() * 1500]);
  for (let x = -50; x <= 450; x += 25) for (let y = -50; y <= 1550; y += 50) samples.push([x, y]);
  for (const [x, y] of samples) {
    const r = K.nearestWalkable(ID, x, y);
    assert.ok(K.isWalkable(ID, r.x, r.y), `(${x},${y}) -> (${r.x},${r.y})`);
    assert.ok(r.node || r.edge);
  }
  // a point already inside is not moved
  const c = z.nodes.sanh;
  const same = K.nearestWalkable(ID, c.x, c.y);
  assert.equal(same.x, c.x);
  assert.equal(same.y, c.y);
  // a point in a wall is pulled out
  assert.equal(K.isWalkable(ID, 380, 1300), false);
  const out = K.nearestWalkable(ID, 380, 1300);
  assert.ok(K.isWalkable(ID, out.x, out.y));
});

test("save: reading never writes; the first write creates S.zones", () => {
  const K = Z();
  const S = { cards: [1], mood: "x" };
  const before = plain(S);
  const st = K.state(S);
  assert.deepEqual(plain(st), { v: 1, nodes: {}, marks: {}, seenGates: {}, visits: {}, stones: {} });
  assert.deepEqual(plain(S), before);
  assert.equal("zones" in S, false);
  assert.equal(K.markNode(S, ID, "cua", 100), true);
  assert.equal(S.zones.v, 1);
  assert.equal(S.zones.nodes["hang_vong_tam:cua"], 100);
});

test("save: repeat writes keep the first timestamp and return false", () => {
  const K = Z(), S = {};
  assert.equal(K.markLandmark(S, ID, "ho_dom_sang", 10), true);
  assert.equal(K.markLandmark(S, ID, "ho_dom_sang", 99), false);
  assert.equal(S.zones.marks["hang_vong_tam:ho_dom_sang"], 10);
  assert.equal(K.markGate(S, "hang.light", 20), true);
  assert.equal(K.markGate(S, "hang.light", 30), false);
  assert.equal(S.zones.seenGates["hang.light"], 20);
  assert.equal(K.markNode(S, ID, "sanh", 40), true);
  assert.equal(K.markNode(S, ID, "sanh", 50), false);
  assert.equal(S.zones.nodes["hang_vong_tam:sanh"], 40);
  assert.equal(K.addVisit(S, ID), true);
  assert.equal(K.addVisit(S, ID), true);
  assert.equal(S.zones.visits[ID], 2);
});

test("save: other keys of S are untouched by every write", () => {
  const K = Z();
  const S = { dhutanga: 1, cards: [{ id: "a" }], nested: { x: [1, 2, { y: 3 }] }, mood: null };
  const before = plain(S);
  K.markNode(S, ID, "cua", 1);
  K.markLandmark(S, ID, "vach_khac", 2);
  K.markGate(S, "hang.light", 3);
  K.addVisit(S, ID);
  const { zones, ...rest } = plain(S);
  assert.deepEqual(rest, before);
  assert.ok(zones);
});

test("save: two characters do not share data", () => {
  const K = Z();
  const A = {}, B = {};
  K.markNode(A, ID, "cua", 1);
  K.addVisit(A, ID);
  assert.equal("zones" in B, false);
  assert.deepEqual(plain(K.state(B).nodes), {});
  K.markNode(B, ID, "ho", 2);
  assert.equal(A.zones.nodes["hang_vong_tam:ho"], undefined);
  assert.notEqual(A.zones, B.zones);
  assert.notEqual(A.zones.nodes, B.zones.nodes);
});

test("save: S.zones survives a JSON round trip and keeps working", () => {
  const K = Z(), S = {};
  K.markNode(S, ID, "cua", 7);
  K.markGate(S, "hang.light", 8);
  K.addVisit(S, ID);
  const back = JSON.parse(JSON.stringify(S));
  assert.deepEqual(back.zones, plain(S.zones));
  assert.equal(K.markNode(back, ID, "cua", 999), false);
  assert.equal(back.zones.nodes["hang_vong_tam:cua"], 7);
  assert.equal(K.markNode(back, ID, "ho", 9), true);
});
