// Accounts, sessions and characters.
// With DATABASE_URL set (e.g. a Neon Postgres connection string) everything lives in Postgres.
// Without it, a JSON file in data/ is used: fine for local testing, but on Render Free that file
// is wiped on every deploy or restart.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SESSION_DAYS = 60;
const MAX_CHARACTERS = 12;
const MAX_TRACES = 500;
const MAX_ENCOUNTERS = 50; // per character: "Từng gặp" keeps the newest ones
const MAX_CONNECTIONS = 100; // per character: saved connections ("Đã lưu" / "Quen") it made itself
const MAX_EVENTS = 3000; // per character: the memory log is pruned past this (oldest "action" events only)
const EVENT_LIST_MAX = 200;
const PROTECTED_SUBJECT = "meta:backfilled"; // never pruned
const REPORT_REASON_MAX = 200;
const PRUNE_EVERY = 50; // pg: trim old traces on every Nth insert, not each time
const newId = () => crypto.randomUUID();
const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");
// 12 random bytes -> 16 base64url chars ([A-Za-z0-9_-]). Opaque: never derived from the character id.
const newHandle = () => crypto.randomBytes(12).toString("base64url");
const isoOrNull = (v) => (v == null ? null : new Date(v).toISOString());
// Character status: "active" (default) or "story_completed" (archived: a finished ghost story, read-only).
const ARCHIVED = "story_completed";
const STATUSES = ["active", ARCHIVED];
const isArchived = (c) => !!c && c.status === ARCHIVED;

// ----- character events (memory log) -----
// Store errors carry a code (NOT_FOUND, ARCHIVED) that the route maps to an HTTP status.
function storeError(code) {
  const e = new Error(code);
  e.storeCode = code;
  return e;
}
// Paging options: after >= 0, limit 1..200 (default 100), optional type.
function listOpts(opts = {}) {
  const after = Number.isSafeInteger(opts.after) && opts.after >= 0 ? opts.after : 0;
  const limit = Number.isSafeInteger(opts.limit) && opts.limit >= 1 ? Math.min(opts.limit, EVENT_LIST_MAX) : 100;
  const type = typeof opts.type === "string" && opts.type ? opts.type : null;
  return { after, limit, type };
}
// What listEvents returns: no character id; only event_id and the global seq identify an event.
function eventView(r) {
  return {
    seq: Number(r.seq), event_id: r.event_id, type: r.type, subject_id: r.subject_id, level: r.level,
    source_type: r.source_type, source_actor_id: r.source_actor_id ?? null, place_id: r.place_id ?? null,
    story_id: r.story_id ?? null, at: Number(r.at),
    client_at: r.client_at == null ? null : Number(r.client_at),
    payload: r.payload || {},
    save_version: r.save_version == null ? null : Number(r.save_version),
  };
}

function summary(c) {
  const mind = (c.data && c.data.mind) || {};
  return {
    id: c.id, name: c.name, role: c.role, createdAt: c.created_at, updatedAt: c.updated_at,
    cards: Object.keys(mind.cards || {}).length, items: (mind.items || []).length,
    carita: mind.carita || null,
    hideProfile: !!c.hide_profile, hideStatus: !!c.hide_status,
    status: c.status || "active",
  };
}

// ---------- Postgres ----------
function pgStore(url, injectedPool) {
  let pool = injectedPool;
  if (!pool) {
    const { Pool } = require("pg");
    pool = new Pool({ connectionString: url, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false }, max: 5 });
  }
  const q = (text, params) => pool.query(text, params);
  // The script runs as one implicit transaction; the advisory lock makes two instances that start at the same time
  // (a deploy overlap, or tests) wait for each other instead of racing on `create table if not exists`.
  const ready = q(`
    select pg_advisory_xact_lock(727001);
    create table if not exists users (
      id text primary key, provider_sub text unique not null, email text, name text, picture text,
      account jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
    create table if not exists sessions (
      token_hash text primary key, user_id text not null references users(id) on delete cascade,
      expires_at timestamptz not null);
    create table if not exists characters (
      id text primary key, user_id text not null references users(id) on delete cascade,
      name text not null, role text not null, data jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now());
    create index if not exists characters_user on characters(user_id);
    alter table characters add column if not exists public_handle text;
    create unique index if not exists characters_public_handle on characters(public_handle);
    alter table characters add column if not exists hide_profile boolean not null default false;
    alter table characters add column if not exists hide_status boolean not null default false;
    alter table characters add column if not exists last_seen_at bigint;
    alter table characters add column if not exists status text not null default 'active';
    create table if not exists encounters (
      char_id text not null references characters(id) on delete cascade,
      other_char_id text not null,
      first_at bigint not null,
      last_at bigint not null,
      count int not null default 1,
      primary key (char_id, other_char_id));
    create index if not exists encounters_char_last on encounters(char_id, last_at desc);
    create table if not exists connections (
      char_id text not null references characters(id) on delete cascade,
      other_char_id text not null,
      created_at bigint not null,
      seen_at bigint,
      primary key (char_id, other_char_id));
    create index if not exists connections_other on connections(other_char_id);
    create table if not exists blocks (
      user_id text not null references users(id) on delete cascade,
      blocked_user_id text not null references users(id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (user_id, blocked_user_id));
    create table if not exists reports (
      id bigserial primary key,
      reporter_user_id text not null references users(id) on delete cascade,
      reported_char_id text not null,
      reported_user_id text not null,
      reason text not null,
      created_at bigint not null);
    create table if not exists traces (
      seq bigserial primary key, id text not null, kind text not null, variant int not null default 0,
      role text, nick text, at bigint not null);
    create table if not exists character_events (
      seq bigserial primary key,
      character_id text not null references characters(id) on delete cascade,
      event_id text not null,
      type text not null,
      subject_id text not null,
      level text,
      source_type text not null,
      source_actor_id text,
      place_id text,
      story_id text,
      at bigint not null,
      client_at bigint,
      payload jsonb not null default '{}'::jsonb,
      save_version int,
      unique (character_id, event_id));
    create index if not exists character_events_char_seq on character_events(character_id, seq);
  `);
  const wait = async () => { await ready; };
  let inserts = 0;
  // Both directions of saved connections between two accounts' characters (used when blocking).
  async function removeConnectionsBetweenUsers(userA, userB) {
    await wait();
    if (!userA || !userB) return;
    await q(
      `delete from connections where
         (char_id in (select id from characters where user_id = $1) and other_char_id in (select id from characters where user_id = $2))
      or (char_id in (select id from characters where user_id = $2) and other_char_id in (select id from characters where user_id = $1))`,
      [userA, userB]);
  }
  return {
    kind: "postgres",
    async loadTraces(limit) {
      await wait();
      const r = await q("select id, kind, variant, role, nick, at from traces order by seq desc limit $1", [limit]);
      return r.rows.reverse().map((t) => ({ id: t.id, kind: t.kind, variant: Number(t.variant), role: t.role, nick: t.nick, at: Number(t.at) }));
    },
    async addTrace(t) {
      await wait();
      await q("insert into traces (id, kind, variant, role, nick, at) values ($1,$2,$3,$4,$5,$6)", [t.id, t.kind, t.variant, t.role, t.nick, t.at]);
      if (inserts++ % PRUNE_EVERY === 0) {
        await q("delete from traces where seq <= (select seq from traces order by seq desc offset $1 limit 1)", [MAX_TRACES]);
      }
    },
    async upsertUser(sub, profile) {
      await wait();
      const r = await q(
        `insert into users (id, provider_sub, email, name, picture) values ($1,$2,$3,$4,$5)
         on conflict (provider_sub) do update set email = excluded.email, name = excluded.name, picture = excluded.picture
         returning id, name, email, picture`,
        [newId(), sub, profile.email || null, profile.name || null, profile.picture || null]);
      return r.rows[0];
    },
    async createSession(userId) {
      await wait();
      const token = crypto.randomBytes(32).toString("base64url");
      await q("insert into sessions (token_hash, user_id, expires_at) values ($1,$2, now() + make_interval(days => $3::int))", [hashToken(token), userId, SESSION_DAYS]);
      return token;
    },
    async sessionUser(token) {
      if (!token) return null;
      await wait();
      const r = await q("select u.id, u.name, u.email, u.picture, u.account from sessions s join users u on u.id = s.user_id where s.token_hash = $1 and s.expires_at > now()", [hashToken(token)]);
      return r.rows[0] || null;
    },
    async deleteSession(token) { await wait(); await q("delete from sessions where token_hash = $1", [hashToken(token)]); },
    async saveAccount(userId, account) { await wait(); await q("update users set account = $2 where id = $1", [userId, account]); },
    async listCharacters(userId) {
      await wait();
      const r = await q("select id, name, role, data, created_at, updated_at, hide_profile, hide_status, status from characters where user_id = $1 order by updated_at desc", [userId]);
      return r.rows.map(summary);
    },
    async createCharacter(userId, name, role, data) {
      await wait();
      const n = await q("select count(*)::int as n from characters where user_id = $1", [userId]);
      if (n.rows[0].n >= MAX_CHARACTERS) throw new Error("too many characters");
      const r = await q("insert into characters (id, user_id, name, role, data) values ($1,$2,$3,$4,$5) returning id, name, role, data, created_at, updated_at", [newId(), userId, name, role, data || {}]);
      return r.rows[0];
    },
    async getCharacter(userId, id) {
      await wait();
      const r = await q("select id, name, role, data, created_at, updated_at, status from characters where user_id = $1 and id = $2", [userId, id]);
      return r.rows[0] || null;
    },
    async saveCharacter(userId, id, data) {
      await wait();
      const r = await q("update characters set data = $3, updated_at = now() where user_id = $1 and id = $2", [userId, id, data]);
      return r.rowCount > 0;
    },
    async renameCharacter(userId, id, name) {
      await wait();
      const r = await q("update characters set name = $3, updated_at = now() where user_id = $1 and id = $2", [userId, id, name]);
      return r.rowCount > 0;
    },
    // Owner only; only the two known values. No public route uses it yet (the ending flow comes later).
    async setCharacterStatus(userId, id, status) {
      await wait();
      if (!STATUSES.includes(status)) return false;
      const r = await q("update characters set status = $3 where user_id = $1 and id = $2", [userId, id, status]);
      return r.rowCount > 0;
    },
    // Cascades by hand (encounters both directions, reports) so it does not depend on FK options.
    async deleteCharacter(userId, id) {
      await wait();
      const own = await q("select id from characters where user_id = $1 and id = $2", [userId, id]);
      if (!own.rows[0]) return;
      await q("delete from encounters where char_id = $1 or other_char_id = $1", [id]);
      await q("delete from reports where reported_char_id = $1", [id]);
      await q("delete from connections where char_id = $1 or other_char_id = $1", [id]);
      await q("delete from character_events where character_id = $1", [id]);
      await q("delete from characters where user_id = $1 and id = $2", [userId, id]);
    },

    // ----- memory log: one row per event, idempotent on (character_id, event_id) -----
    // One transaction. The character row is locked so two batches for one character cannot race on the cap.
    // Throws storeError NOT_FOUND / ARCHIVED; the route checks both first, this is the data-layer refusal.
    async addEvents(charId, events, nowMs = Date.now()) {
      await wait();
      const client = await pool.connect();
      try {
        await client.query("begin");
        const own = await client.query("select status from characters where id = $1 for update", [charId]);
        if (!own.rows[0]) throw storeError("NOT_FOUND");
        if (isArchived(own.rows[0])) throw storeError("ARCHIVED");
        const out = [];
        for (const e of events) {
          const r = await client.query(
            `insert into character_events (character_id, event_id, type, subject_id, level, source_type, source_actor_id, place_id, story_id, at, client_at, payload, save_version)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             on conflict (character_id, event_id) do nothing returning seq`,
            [charId, e.event_id, e.type, e.subject_id, e.level, e.source_type, e.source_actor_id, e.place_id, e.story_id,
              nowMs, e.client_at, JSON.stringify(e.payload || {}), e.save_version]);
          out.push({ event_id: e.event_id, status: r.rowCount ? "created" : "duplicate" });
        }
        // Over the cap: drop the oldest plain actions. Discoveries, milestones and the backfill marker are never dropped.
        const n = (await client.query("select count(*)::int as n from character_events where character_id = $1", [charId])).rows[0].n;
        const excess = n - MAX_EVENTS;
        if (excess > 0) {
          await client.query(
            `delete from character_events where seq in (
               select seq from character_events
               where character_id = $1 and type = 'action' and subject_id <> $2
               order by seq asc limit $3)`,
            [charId, PROTECTED_SUBJECT, excess]);
        }
        await client.query("commit");
        return out;
      } catch (err) {
        await client.query("rollback").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    // Owner-scoped by the caller (route checks the character first). Ascending seq. Archived characters can be read.
    async listEvents(charId, opts) {
      await wait();
      const { after, limit, type } = listOpts(opts);
      const params = [charId, after, limit];
      if (type) params.push(type);
      const r = await q(
        `select seq, event_id, type, subject_id, level, source_type, source_actor_id, place_id, story_id, at, client_at, payload, save_version
         from character_events where character_id = $1 and seq > $2 ${type ? "and type = $4" : ""}
         order by seq asc limit $3`,
        params);
      return r.rows.map(eventView);
    },

    // ----- social: handles, flags, encounters, blocks, reports -----
    // Returns the character's public handle, creating it on first use (old rows are backfilled this way).
    async ensureHandle(userId, charId) {
      await wait();
      const cur = await q("select public_handle from characters where id = $1 and user_id = $2", [charId, userId]);
      if (!cur.rows[0]) return null;
      if (cur.rows[0].public_handle) return cur.rows[0].public_handle;
      for (let i = 0; i < 5; i++) {
        try {
          const r = await q("update characters set public_handle = $3 where id = $1 and user_id = $2 and public_handle is null returning public_handle", [charId, userId, newHandle()]);
          if (r.rows[0]) return r.rows[0].public_handle;
          const again = await q("select public_handle from characters where id = $1 and user_id = $2", [charId, userId]);
          return again.rows[0] ? again.rows[0].public_handle : null;
        } catch (err) {
          if (err.code !== "23505") throw err; // unique collision on the handle: try another
        }
      }
      throw new Error("could not allocate a handle");
    },
    async getByHandle(handle) {
      await wait();
      if (typeof handle !== "string" || !handle) return null;
      const r = await q("select id, user_id, name, role, data, created_at, hide_profile, hide_status, status from characters where public_handle = $1", [handle]);
      const c = r.rows[0];
      if (!c) return null;
      return { id: c.id, user_id: c.user_id, name: c.name, role: c.role, data: c.data || {}, created_at: isoOrNull(c.created_at), hide_profile: !!c.hide_profile, hide_status: !!c.hide_status, status: c.status || "active" };
    },
    async setFlags(userId, charId, flags = {}) {
      await wait();
      const hp = typeof flags.hideProfile === "boolean" ? flags.hideProfile : null;
      const hs = typeof flags.hideStatus === "boolean" ? flags.hideStatus : null;
      const r = await q("update characters set hide_profile = coalesce($3::boolean, hide_profile), hide_status = coalesce($4::boolean, hide_status) where user_id = $1 and id = $2", [userId, charId, hp, hs]);
      return r.rowCount > 0;
    },
    async touchSeen(charId, nowMs = Date.now()) {
      await wait();
      await q("update characters set last_seen_at = $2 where id = $1", [charId, nowMs]);
    },
    // One row per direction. Refuses self-pairs and two characters of the same account (the join filters it).
    async recordEncounter(charId, otherCharId, nowMs) {
      await wait();
      if (!charId || !otherCharId || charId === otherCharId) return false;
      const r = await q(
        `insert into encounters (char_id, other_char_id, first_at, last_at, count)
         select a.id, b.id, $3::bigint, $3::bigint, 1
         from characters a join characters b on b.id = $2::text
         where a.id = $1::text and a.user_id <> b.user_id
           and a.status <> 'story_completed' and b.status <> 'story_completed'
         on conflict (char_id, other_char_id) do update set last_at = excluded.last_at, count = encounters.count + 1`,
        [charId, otherCharId, nowMs]);
      await q(
        "delete from encounters where char_id = $1 and other_char_id not in (select other_char_id from encounters where char_id = $1 order by last_at desc limit $2)",
        [charId, MAX_ENCOUNTERS]);
      return r.rowCount > 0;
    },
    async listEncounters(charId) {
      await wait();
      const r = await q(
        `select e.other_char_id, e.first_at, e.last_at, e.count, c.user_id as other_user_id, c.name, c.role, c.public_handle, c.hide_profile
         from encounters e join characters c on c.id = e.other_char_id
         where e.char_id = $1 order by e.last_at desc limit $2`,
        [charId, MAX_ENCOUNTERS]);
      return r.rows.map((x) => ({
        otherCharId: x.other_char_id, otherUserId: x.other_user_id, name: x.name, role: x.role,
        handle: x.public_handle || null, hideProfile: !!x.hide_profile,
        firstAt: Number(x.first_at), lastAt: Number(x.last_at), count: Number(x.count),
      }));
    },
    async addBlock(userId, blockedUserId) {
      await wait();
      if (!userId || !blockedUserId || userId === blockedUserId) return false;
      await q("insert into blocks (user_id, blocked_user_id) values ($1,$2) on conflict do nothing", [userId, blockedUserId]);
      await removeConnectionsBetweenUsers(userId, blockedUserId);
      return true;
    },
    // ----- connections: one row per direction (char_id saved other_char_id) -----
    async addConnection(charId, otherCharId, nowMs = Date.now()) {
      await wait();
      if (!charId || !otherCharId || charId === otherCharId) return false;
      // Both characters must exist and belong to different accounts.
      const pair = await q(
        "select 1 from characters a join characters b on b.id = $2::text where a.id = $1::text and a.user_id <> b.user_id and a.status <> 'story_completed' and b.status <> 'story_completed'",
        [charId, otherCharId]);
      if (!pair.rows[0]) return false;
      const have = await q("select 1 from connections where char_id = $1 and other_char_id = $2", [charId, otherCharId]);
      if (have.rows[0]) return true; // idempotent
      const r = await q(
        `insert into connections (char_id, other_char_id, created_at, seen_at)
         select $1::text, $2::text, $3::bigint, null
         where (select count(*) from connections where char_id = $1::text) < $4::int
         on conflict (char_id, other_char_id) do nothing`,
        [charId, otherCharId, nowMs, MAX_CONNECTIONS]);
      return r.rowCount > 0;
    },
    async removeConnection(charId, otherCharId) {
      await wait();
      await q("delete from connections where char_id = $1 and other_char_id = $2", [charId, otherCharId]);
    },
    async connectionPair(charId, otherCharId) {
      await wait();
      const r = await q(
        `select exists(select 1 from connections where char_id = $1 and other_char_id = $2) as i_saved,
                exists(select 1 from connections where char_id = $2 and other_char_id = $1) as they_saved`,
        [charId, otherCharId]);
      return { iSaved: !!r.rows[0].i_saved, theySaved: !!r.rows[0].they_saved };
    },
    // "Từng gặp" in either direction.
    async hasEncounter(charId, otherCharId) {
      await wait();
      if (!charId || !otherCharId || charId === otherCharId) return false;
      const r = await q(
        "select 1 from encounters where (char_id = $1 and other_char_id = $2) or (char_id = $2 and other_char_id = $1) limit 1",
        [charId, otherCharId]);
      return r.rows.length > 0;
    },
    // Every character that either side saved. Characters that no longer exist are dropped by the join.
    async listConnections(charId) {
      await wait();
      const r = await q(
        `select o.id as other_char_id, o.user_id as other_user_id, o.name, o.role, o.public_handle,
                o.hide_profile, o.hide_status, o.last_seen_at, o.status as other_status,
                mine.created_at as my_at, theirs.created_at as their_at, theirs.seen_at as their_seen_at
         from (select other_char_id as oid from connections where char_id = $1
               union select char_id from connections where other_char_id = $1) x
         join characters o on o.id = x.oid
         left join connections mine on mine.char_id = $1 and mine.other_char_id = o.id
         left join connections theirs on theirs.char_id = o.id and theirs.other_char_id = $1
         where x.oid <> $1`,
        [charId]);
      return r.rows.map((x) => ({
        otherCharId: x.other_char_id, otherUserId: x.other_user_id, handle: x.public_handle || null,
        name: x.name, role: x.role, hideProfile: !!x.hide_profile, hideStatus: !!x.hide_status,
        archived: x.other_status === ARCHIVED,
        lastSeenAt: x.last_seen_at == null ? null : Number(x.last_seen_at),
        iSaved: x.my_at != null, theySaved: x.their_at != null,
        savedAt: Number(x.my_at ?? x.their_at),
        incomingUnseen: x.their_at != null && x.my_at == null && x.their_seen_at == null,
      }));
    },
    // Marks the incoming connections (someone saved me) as looked at.
    async markIncomingSeen(charId, nowMs = Date.now()) {
      await wait();
      await q("update connections set seen_at = $2 where other_char_id = $1 and seen_at is null", [charId, nowMs]);
    },
    // Map charId -> number of incoming connections not yet seen and not yet saved back.
    async countIncomingUnseen(charIds) {
      await wait();
      const out = new Map();
      const ids = (Array.isArray(charIds) ? charIds : []).filter((x) => typeof x === "string" && x);
      if (!ids.length) return out;
      const r = await q(
        `select t.other_char_id as cid, count(*)::int as n from connections t
         where t.other_char_id = any($1::text[]) and t.seen_at is null
           and not exists (select 1 from connections m where m.char_id = t.other_char_id and m.other_char_id = t.char_id)
         group by t.other_char_id`,
        [ids]);
      for (const row of r.rows) out.set(row.cid, Number(row.n));
      return out;
    },
    removeConnectionsBetweenUsers,
    async removeBlock(userId, blockedUserId) {
      await wait();
      await q("delete from blocks where user_id = $1 and blocked_user_id = $2", [userId, blockedUserId]);
    },
    async isBlockedEither(userA, userB) {
      await wait();
      if (!userA || !userB) return false;
      const r = await q(
        "select 1 from blocks where (user_id = $1 and blocked_user_id = $2) or (user_id = $2 and blocked_user_id = $1) limit 1",
        [userA, userB]);
      return r.rows.length > 0;
    },
    async addReport(reporterUserId, reportedCharId, reason, nowMs) {
      await wait();
      const r = await q(
        `insert into reports (reporter_user_id, reported_char_id, reported_user_id, reason, created_at)
         select $1::text, c.id, c.user_id, $3::text, $4::bigint from characters c where c.id = $2::text`,
        [reporterUserId, reportedCharId, String(reason ?? "").slice(0, REPORT_REASON_MAX), nowMs]);
      return r.rowCount > 0;
    },
  };
}

// ---------- JSON file (local testing) ----------
function fileStore(file, tracesFile) {
  let traces = [];
  try { const l = JSON.parse(fs.readFileSync(tracesFile, "utf8")); if (Array.isArray(l)) traces = l.slice(-MAX_TRACES); } catch {}
  let tracesTimer = null;
  const persistTraces = () => {
    clearTimeout(tracesTimer);
    tracesTimer = setTimeout(() => {
      fs.mkdirSync(path.dirname(tracesFile), { recursive: true });
      fs.writeFile(tracesFile, JSON.stringify(traces, null, 1), (err) => err && console.error("save traces failed:", err.message));
    }, 500);
  };
  // encounters: keyed "charId|otherCharId"; connections: same key, one row per direction;
  // blocks: keyed "userId|blockedUserId"; reports: array.
  // events: the memory log (one object per event, global seq in event_seq); pruned per character in addEvents.
  let db = { users: {}, sessions: {}, characters: {}, encounters: {}, connections: {}, blocks: {}, reports: [], events: [], event_seq: 0 };
  try { db = { ...db, ...JSON.parse(fs.readFileSync(file, "utf8")) }; } catch {}
  let timer = null;
  const persist = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFile(file, JSON.stringify(db), (err) => err && console.error("save accounts failed:", err.message));
    }, 300);
  };
  const now = () => new Date().toISOString();
  // Both directions of saved connections between two accounts' characters (used when blocking).
  function removeConnectionsBetweenUsers(userA, userB) {
    if (!userA || !userB) return;
    for (const k of Object.keys(db.connections)) {
      const t = db.connections[k];
      const ownerA = db.characters[t.char_id]?.user_id, ownerB = db.characters[t.other_char_id]?.user_id;
      if ((ownerA === userA && ownerB === userB) || (ownerA === userB && ownerB === userA)) delete db.connections[k];
    }
    persist();
  }
  return {
    kind: "file",
    async loadTraces(limit) { return limit > 0 ? traces.slice(-limit) : []; },
    async addTrace(t) {
      traces.push(t);
      if (traces.length > MAX_TRACES) traces = traces.slice(-MAX_TRACES);
      persistTraces();
    },
    async upsertUser(sub, profile) {
      let u = Object.values(db.users).find((x) => x.provider_sub === sub);
      if (!u) { u = { id: newId(), provider_sub: sub, account: {}, created_at: now() }; db.users[u.id] = u; }
      Object.assign(u, { email: profile.email || null, name: profile.name || null, picture: profile.picture || null });
      persist();
      return { id: u.id, name: u.name, email: u.email, picture: u.picture };
    },
    async createSession(userId) {
      const token = crypto.randomBytes(32).toString("base64url");
      db.sessions[hashToken(token)] = { user_id: userId, expires_at: Date.now() + SESSION_DAYS * 864e5 };
      persist();
      return token;
    },
    async sessionUser(token) {
      if (!token) return null;
      const s = db.sessions[hashToken(token)];
      if (!s || s.expires_at < Date.now()) return null;
      const u = db.users[s.user_id];
      return u ? { id: u.id, name: u.name, email: u.email, picture: u.picture, account: u.account || {} } : null;
    },
    async deleteSession(token) { delete db.sessions[hashToken(token)]; persist(); },
    async saveAccount(userId, account) { if (db.users[userId]) { db.users[userId].account = account; persist(); } },
    async listCharacters(userId) {
      return Object.values(db.characters).filter((c) => c.user_id === userId).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)).map(summary);
    },
    async createCharacter(userId, name, role, data) {
      if (Object.values(db.characters).filter((c) => c.user_id === userId).length >= MAX_CHARACTERS) throw new Error("too many characters");
      const c = { id: newId(), user_id: userId, name, role, data: data || {}, created_at: now(), updated_at: now(), hide_profile: false, hide_status: false, status: "active" };
      db.characters[c.id] = c; persist();
      return c;
    },
    async getCharacter(userId, id) { const c = db.characters[id]; return c && c.user_id === userId ? c : null; },
    async saveCharacter(userId, id, data) {
      const c = db.characters[id];
      if (!c || c.user_id !== userId) return false;
      c.data = data; c.updated_at = now(); persist();
      return true;
    },
    async renameCharacter(userId, id, name) {
      const c = db.characters[id];
      if (!c || c.user_id !== userId) return false;
      c.name = name; c.updated_at = now(); persist();
      return true;
    },
    async setCharacterStatus(userId, id, status) {
      const c = db.characters[id];
      if (!c || c.user_id !== userId || !STATUSES.includes(status)) return false;
      c.status = status; persist();
      return true;
    },
    async deleteCharacter(userId, id) {
      const c = db.characters[id];
      if (!c || c.user_id !== userId) return;
      delete db.characters[id];
      for (const k of Object.keys(db.encounters)) {
        const e = db.encounters[k];
        if (e.char_id === id || e.other_char_id === id) delete db.encounters[k];
      }
      db.reports = db.reports.filter((r) => r.reported_char_id !== id);
      for (const k of Object.keys(db.connections)) {
        const t = db.connections[k];
        if (t.char_id === id || t.other_char_id === id) delete db.connections[k];
      }
      db.events = db.events.filter((e) => e.character_id !== id);
      persist();
    },

    // ----- memory log (same rules as the Postgres store) -----
    async addEvents(charId, events, nowMs = Date.now()) {
      const c = db.characters[charId];
      if (!c) throw storeError("NOT_FOUND");
      if (isArchived(c)) throw storeError("ARCHIVED");
      const out = [];
      for (const e of events) {
        if (db.events.some((x) => x.character_id === charId && x.event_id === e.event_id)) {
          out.push({ event_id: e.event_id, status: "duplicate" });
          continue;
        }
        db.event_seq = (db.event_seq || 0) + 1;
        db.events.push({
          seq: db.event_seq, character_id: charId, event_id: e.event_id, type: e.type, subject_id: e.subject_id,
          level: e.level, source_type: e.source_type, source_actor_id: e.source_actor_id, place_id: e.place_id,
          story_id: e.story_id, at: nowMs, client_at: e.client_at, payload: e.payload || {}, save_version: e.save_version,
        });
        out.push({ event_id: e.event_id, status: "created" });
      }
      // db.events is in seq order, so the first matches are the oldest.
      const mine = db.events.filter((x) => x.character_id === charId);
      const excess = mine.length - MAX_EVENTS;
      if (excess > 0) {
        const drop = new Set(mine.filter((x) => x.type === "action" && x.subject_id !== PROTECTED_SUBJECT).slice(0, excess).map((x) => x.seq));
        db.events = db.events.filter((x) => !drop.has(x.seq));
      }
      persist();
      return out;
    },
    async listEvents(charId, opts) {
      const { after, limit, type } = listOpts(opts);
      return db.events
        .filter((e) => e.character_id === charId && e.seq > after && (!type || e.type === type))
        .slice(0, limit)
        .map(eventView);
    },

    // ----- social: handles, flags, encounters, blocks, reports -----
    async ensureHandle(userId, charId) {
      const c = db.characters[charId];
      if (!c || c.user_id !== userId) return null;
      if (!c.public_handle) {
        let h;
        do { h = newHandle(); } while (Object.values(db.characters).some((x) => x.public_handle === h));
        c.public_handle = h;
        persist();
      }
      return c.public_handle;
    },
    async getByHandle(handle) {
      if (typeof handle !== "string" || !handle) return null;
      const c = Object.values(db.characters).find((x) => x.public_handle === handle);
      if (!c) return null;
      return { id: c.id, user_id: c.user_id, name: c.name, role: c.role, data: c.data || {}, created_at: c.created_at, hide_profile: !!c.hide_profile, hide_status: !!c.hide_status, status: c.status || "active" };
    },
    async setFlags(userId, charId, flags = {}) {
      const c = db.characters[charId];
      if (!c || c.user_id !== userId) return false;
      if (typeof flags.hideProfile === "boolean") c.hide_profile = flags.hideProfile;
      if (typeof flags.hideStatus === "boolean") c.hide_status = flags.hideStatus;
      persist();
      return true;
    },
    async touchSeen(charId, nowMs = Date.now()) {
      const c = db.characters[charId];
      if (c) { c.last_seen_at = nowMs; persist(); }
    },
    async recordEncounter(charId, otherCharId, nowMs) {
      const a = db.characters[charId], b = db.characters[otherCharId];
      if (!a || !b || charId === otherCharId || a.user_id === b.user_id) return false;
      if (isArchived(a) || isArchived(b)) return false;
      const k = `${charId}|${otherCharId}`;
      const e = db.encounters[k];
      if (e) { e.last_at = nowMs; e.count += 1; }
      else db.encounters[k] = { char_id: charId, other_char_id: otherCharId, first_at: nowMs, last_at: nowMs, count: 1 };
      const mine = Object.entries(db.encounters)
        .filter(([, v]) => v.char_id === charId)
        .sort((x, y) => y[1].last_at - x[1].last_at);
      for (const [key] of mine.slice(MAX_ENCOUNTERS)) delete db.encounters[key];
      persist();
      return true;
    },
    async listEncounters(charId) {
      return Object.values(db.encounters)
        .filter((e) => e.char_id === charId)
        .sort((x, y) => y.last_at - x.last_at)
        .slice(0, MAX_ENCOUNTERS)
        .flatMap((e) => {
          const o = db.characters[e.other_char_id];
          if (!o) return []; // character gone: drop the row
          return [{
            otherCharId: o.id, otherUserId: o.user_id, name: o.name, role: o.role,
            handle: o.public_handle || null, hideProfile: !!o.hide_profile,
            firstAt: e.first_at, lastAt: e.last_at, count: e.count,
          }];
        });
    },
    async addBlock(userId, blockedUserId) {
      if (!userId || !blockedUserId || userId === blockedUserId) return false;
      db.blocks[`${userId}|${blockedUserId}`] = { user_id: userId, blocked_user_id: blockedUserId, created_at: now() };
      removeConnectionsBetweenUsers(userId, blockedUserId);
      persist();
      return true;
    },
    // ----- connections: one row per direction (char_id saved other_char_id) -----
    async addConnection(charId, otherCharId, nowMs = Date.now()) {
      const a = db.characters[charId], b = db.characters[otherCharId];
      if (!a || !b || charId === otherCharId || a.user_id === b.user_id) return false;
      if (isArchived(a) || isArchived(b)) return false;
      const k = `${charId}|${otherCharId}`;
      if (db.connections[k]) return true; // idempotent
      if (Object.values(db.connections).filter((c) => c.char_id === charId).length >= MAX_CONNECTIONS) return false;
      db.connections[k] = { char_id: charId, other_char_id: otherCharId, created_at: nowMs, seen_at: null };
      persist();
      return true;
    },
    async removeConnection(charId, otherCharId) {
      delete db.connections[`${charId}|${otherCharId}`];
      persist();
    },
    async connectionPair(charId, otherCharId) {
      return { iSaved: !!db.connections[`${charId}|${otherCharId}`], theySaved: !!db.connections[`${otherCharId}|${charId}`] };
    },
    async hasEncounter(charId, otherCharId) {
      if (!charId || !otherCharId || charId === otherCharId) return false;
      return !!(db.encounters[`${charId}|${otherCharId}`] || db.encounters[`${otherCharId}|${charId}`]);
    },
    async listConnections(charId) {
      const ids = new Set();
      for (const c of Object.values(db.connections)) {
        if (c.char_id === charId) ids.add(c.other_char_id);
        else if (c.other_char_id === charId) ids.add(c.char_id);
      }
      ids.delete(charId);
      return [...ids].flatMap((oid) => {
        const o = db.characters[oid];
        if (!o) return []; // character gone: drop the row
        const mine = db.connections[`${charId}|${oid}`];
        const theirs = db.connections[`${oid}|${charId}`];
        if (!mine && !theirs) return [];
        return [{
          otherCharId: oid, otherUserId: o.user_id, handle: o.public_handle || null,
          name: o.name, role: o.role, hideProfile: !!o.hide_profile, hideStatus: !!o.hide_status,
          archived: isArchived(o),
          lastSeenAt: o.last_seen_at == null ? null : Number(o.last_seen_at),
          iSaved: !!mine, theySaved: !!theirs,
          savedAt: Number(mine ? mine.created_at : theirs.created_at),
          incomingUnseen: !!theirs && !mine && theirs.seen_at == null,
        }];
      });
    },
    async markIncomingSeen(charId, nowMs = Date.now()) {
      let changed = false;
      for (const t of Object.values(db.connections)) {
        if (t.other_char_id === charId && t.seen_at == null) { t.seen_at = nowMs; changed = true; }
      }
      if (changed) persist();
    },
    async countIncomingUnseen(charIds) {
      const out = new Map();
      const want = new Set(Array.isArray(charIds) ? charIds : []);
      for (const t of Object.values(db.connections)) {
        if (!want.has(t.other_char_id) || t.seen_at != null) continue;
        if (db.connections[`${t.other_char_id}|${t.char_id}`]) continue; // already saved back: not new
        out.set(t.other_char_id, (out.get(t.other_char_id) || 0) + 1);
      }
      return out;
    },
    removeConnectionsBetweenUsers,
    async removeBlock(userId, blockedUserId) {
      delete db.blocks[`${userId}|${blockedUserId}`];
      persist();
    },
    async isBlockedEither(userA, userB) {
      if (!userA || !userB) return false;
      return !!(db.blocks[`${userA}|${userB}`] || db.blocks[`${userB}|${userA}`]);
    },
    async addReport(reporterUserId, reportedCharId, reason, nowMs) {
      const c = db.characters[reportedCharId];
      if (!c) return false;
      db.reports.push({
        id: newId(), reporter_user_id: reporterUserId, reported_char_id: c.id, reported_user_id: c.user_id,
        reason: String(reason ?? "").slice(0, REPORT_REASON_MAX), created_at: nowMs,
      });
      persist();
      return true;
    },
  };
}

function createStore(opts = {}) {
  if (opts.pool) return pgStore(null, opts.pool);
  if (process.env.DATABASE_URL && !opts.accountsFile) return pgStore(process.env.DATABASE_URL);
  const dir = path.join(__dirname, "data");
  return fileStore(opts.accountsFile || path.join(dir, "accounts.json"), opts.tracesFile || path.join(dir, "traces.json"));
}

// One store (and one pg pool) for the whole process, shared by auth.js and server.js.
let shared = null;
const getStore = () => shared || (shared = createStore());

module.exports = { createStore, getStore, isArchived, ARCHIVED, STATUSES, MAX_CHARACTERS, MAX_TRACES, MAX_ENCOUNTERS, MAX_CONNECTIONS, MAX_EVENTS, EVENT_LIST_MAX, PROTECTED_SUBJECT, REPORT_REASON_MAX };
