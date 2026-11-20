// Smoke test of the Postgres store against a REAL database.
// Skipped unless TEST_DATABASE_URL is set, e.g. with a throwaway Docker database:
//   docker run -d --name dh-pg-test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=dh_test -p 54329:5432 postgres:16
//   TEST_DATABASE_URL=postgresql://postgres:test@localhost:54329/dh_test npm test
// Everything runs inside a throwaway schema (created and dropped by this test), so the database itself is left alone.
const test = require("node:test");
const assert = require("node:assert/strict");

const URL = process.env.TEST_DATABASE_URL;
const skip = !URL && "set TEST_DATABASE_URL to run the Postgres smoke test";

test("postgres store: schema twice, accounts, characters, social, connections, cascade", { skip }, async () => {
  const { Pool } = require("pg");
  const { createStore } = require("../store");
  const schema = "smoke_" + Math.random().toString(36).slice(2, 10);
  const admin = new Pool({ connectionString: URL, max: 1 });
  await admin.query(`create schema ${schema}`);
  const mkPool = () => new Pool({ connectionString: URL, max: 3, options: `-c search_path=${schema}` });
  const pools = [mkPool(), mkPool()];
  try {
    // 1. the schema script must be safe to run repeatedly (two stores, same schema)
    const store = createStore({ pool: pools[0] });
    const again = createStore({ pool: pools[1] });
    assert.deepEqual(await again.loadTraces(5), []);

    // 2. accounts and sessions
    const u1 = await store.upsertUser("smoke:1", { name: "Một", email: null, picture: null });
    const u2 = await store.upsertUser("smoke:2", { name: "Hai", email: null, picture: null });
    const u3 = await store.upsertUser("smoke:3", { name: "Ba", email: null, picture: null });
    const token = await store.createSession(u1.id);
    assert.equal((await store.sessionUser(token)).id, u1.id);
    await store.deleteSession(token);
    assert.equal(await store.sessionUser(token), null);

    // 3. characters
    const a = await store.createCharacter(u1.id, "A", "villager", { mind: { carita: "tin", items: ["den_nho"] } });
    const a2 = await store.createCharacter(u1.id, "A2", "monk", {});
    const b = await store.createCharacter(u2.id, "B", "monk", {});
    const c = await store.createCharacter(u3.id, "C", "ghost", {});
    assert.equal((await store.listCharacters(u1.id)).length, 2);
    assert.equal(await store.renameCharacter(u1.id, a.id, "A1"), true);
    assert.equal((await store.getCharacter(u1.id, a.id)).name, "A1");
    assert.equal(await store.getCharacter(u2.id, a.id), null, "another account cannot read it");
    assert.equal(await store.saveCharacter(u1.id, a.id, { mind: { carita: "tham" } }), true);

    // 4. handles, flags
    const ha = await store.ensureHandle(u1.id, a.id);
    assert.equal(await store.ensureHandle(u1.id, a.id), ha, "handle is stable");
    const hb = await store.ensureHandle(u2.id, b.id);
    assert.notEqual(ha, hb);
    assert.equal((await store.getByHandle(ha)).id, a.id);
    assert.equal(await store.setFlags(u1.id, a.id, { hideProfile: true, hideStatus: true }), true);
    const flagged = await store.getByHandle(ha);
    assert.equal(flagged.hide_profile, true);
    assert.equal(flagged.hide_status, true);
    await store.setFlags(u1.id, a.id, { hideProfile: false, hideStatus: false });
    await store.touchSeen(b.id, 1000);

    // 5. encounters: never between two characters of one account
    assert.equal(await store.recordEncounter(a.id, a2.id, 1), false);
    assert.equal(await store.recordEncounter(a.id, b.id, 2000), true);
    assert.equal(await store.recordEncounter(b.id, a.id, 2000), true);
    assert.equal(await store.recordEncounter(a.id, b.id, 3000), true);
    const enc = await store.listEncounters(a.id);
    assert.equal(enc.length, 1);
    assert.equal(enc[0].count, 2);
    assert.equal(enc[0].handle, hb);
    assert.equal(await store.hasEncounter(a.id, b.id), true);
    assert.equal(await store.hasEncounter(a.id, c.id), false);

    // 6. connections: one row per direction
    assert.equal(await store.addConnection(a.id, a2.id), false, "same account refused");
    assert.equal(await store.addConnection(a.id, b.id, 4000), true);
    assert.equal(await store.addConnection(a.id, b.id, 4001), true, "idempotent");
    assert.deepEqual(await store.connectionPair(a.id, b.id), { iSaved: true, theySaved: false });
    assert.equal((await store.countIncomingUnseen([b.id])).get(b.id), 1);
    await store.markIncomingSeen(b.id, 5000);
    assert.equal((await store.countIncomingUnseen([b.id])).get(b.id) || 0, 0);
    assert.equal(await store.addConnection(b.id, a.id, 6000), true);
    assert.deepEqual(await store.connectionPair(a.id, b.id), { iSaved: true, theySaved: true });
    const list = await store.listConnections(a.id);
    assert.equal(list.length, 1);
    assert.equal(list[0].handle, hb);
    assert.equal(list[0].iSaved && list[0].theySaved, true);

    // 7. reports and blocks (a block removes connections between the two accounts)
    assert.equal(await store.addReport(u1.id, c.id, "thử", 7000), true);
    await store.recordEncounter(a.id, c.id, 8000);
    assert.equal(await store.addConnection(a.id, c.id, 8001), true);
    assert.equal(await store.addBlock(u1.id, u3.id), true);
    assert.equal(await store.isBlockedEither(u1.id, u3.id), true);
    assert.equal(await store.isBlockedEither(u3.id, u1.id), true);
    assert.equal((await store.connectionPair(a.id, c.id)).iSaved, false, "block removed the connection");
    await store.removeBlock(u1.id, u3.id);
    assert.equal(await store.isBlockedEither(u1.id, u3.id), false);

    // 8. archived characters (only when the store has the feature)
    if (typeof store.setCharacterStatus === "function") {
      assert.equal(await store.setCharacterStatus(u2.id, a.id, "story_completed"), false, "owner only");
      assert.equal(await store.setCharacterStatus(u3.id, c.id, "nope"), false, "known values only");
      assert.equal(await store.setCharacterStatus(u3.id, c.id, "story_completed"), true);
      assert.equal(await store.recordEncounter(a.id, c.id, 9000), false);
      assert.equal(await store.addConnection(a.id, c.id, 9001), false);
      assert.equal((await store.getByHandle(await store.ensureHandle(u3.id, c.id))).status, "story_completed");
    }

    // 9. traces
    await store.addTrace({ id: "t1", kind: "lamp", variant: 0, role: "monk", nick: "x", at: 1 });
    assert.equal((await store.loadTraces(5)).length, 1);

    // 10. deleting a character removes its encounters and connections in both directions
    await store.deleteCharacter(u2.id, b.id);
    assert.equal((await store.listEncounters(a.id)).filter((e) => e.handle === hb).length, 0);
    assert.equal((await store.listConnections(a.id)).filter((e) => e.handle === hb).length, 0);

    // 11. memory log: idempotent writes, paging, cascade on delete
    const d = await store.createCharacter(u2.id, "D", "monk", {}); // fresh: b was deleted above
    const mk = (id, extra = {}) => ({
      event_id: id, type: "discovery", subject_id: "disc:cho", level: "seen", source_type: "observation",
      source_actor_id: null, place_id: null, story_id: null, payload: {}, client_at: null, save_version: null, ...extra,
    });
    assert.deepEqual(await store.addEvents(a.id, [mk("smoke.e1"), mk("smoke.e2")], 10000), [
      { event_id: "smoke.e1", status: "created" }, { event_id: "smoke.e2", status: "created" },
    ]);
    assert.deepEqual(await store.addEvents(a.id, [mk("smoke.e1")], 10001), [{ event_id: "smoke.e1", status: "duplicate" }]);
    const page1 = await store.listEvents(a.id, { limit: 1 });
    assert.equal(page1.length, 1);
    assert.equal(page1[0].event_id, "smoke.e1");
    assert.equal(page1[0].at, 10000, "first write keeps its time");
    const page2 = await store.listEvents(a.id, { after: page1[0].seq, limit: 5 });
    assert.deepEqual(page2.map((e) => e.event_id), ["smoke.e2"]);
    assert.equal(JSON.stringify(page2[0]).includes(a.id), false, "no character id in a row");
    await store.addEvents(d.id, [mk("smoke.b1")], 10002);
    await store.addEvents(d.id, [mk("smoke.b2", { type: "action", subject_id: "meta:backfilled" })], 10003);
    assert.equal((await store.listEvents(d.id)).length, 2);
    assert.equal((await store.listEvents(a.id, { type: "action" })).length, 0, "type filter");
    await assert.rejects(store.addEvents(c.id, [mk("smoke.c1")], 1), (e) => e.storeCode === "ARCHIVED", "archived c refuses writes");
    assert.equal((await store.listEvents(c.id)).length, 0);
    await store.deleteCharacter(u2.id, d.id);
    const left = await pools[0].query("select count(*)::int as n from character_events where character_id = $1", [d.id]);
    assert.equal(left.rows[0].n, 0, "events cascade with the character");
    assert.equal((await store.listEvents(a.id)).length, 2, "other character's events stay");
  } finally {
    for (const p of pools) await p.end().catch(() => {});
    await admin.query(`drop schema ${schema} cascade`).catch(() => {});
    await admin.end().catch(() => {});
  }
});
