// Event catalog: the closed list of memory events a character may record, and the rules that check them.
// Shared by the browser (window.EventCatalog) and the server (module.exports). No dependencies.
// The server is the authority: it validates every event with validate() before anything is stored.
(function () {
  const TYPES = Object.freeze(["discovery", "report", "milestone", "action", "world_change"]);
  const SOURCE_TYPES = Object.freeze(["observation", "report", "evidence"]);
  const LEVELS = Object.freeze(["heard", "seen", "confirmed"]);
  // Types that exist in the design but have no MVP rules yet: always rejected.
  const RESERVED_TYPES = Object.freeze(["report", "world_change"]);
  const EVENT_ID_RE = /^[a-z0-9_.:-]{3,80}$/;
  const MILESTONE_ID_RE = /^[a-z0-9_]{2,40}$/;
  // The 12 Discover entries (public/encounters.js ENTRIES). A test keeps this list equal to the source.
  const DISCOVER_IDS = Object.freeze([
    "cho", "su_gia", "chu_thien", "tho_than", "be_na", "ba_ngoai",
    "dia_than", "hang", "day_hang", "ao_trang", "thien_cung", "xe_ngua",
  ]);
  const BACKFILL_SUBJECT = "meta:backfilled";
  const REF_MAX = 60; // source_actor_id, place_id, story_id
  const REF_RE = /^[A-Za-z0-9_.:-]{1,60}$/;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const PAYLOAD_MAX_BYTES = 2048;
  const CLIENT_AT_MAX = Number.MAX_SAFE_INTEGER;
  const SAVE_VERSION_MAX = 2147483647;
  // Fields a client may send. Anything else is dropped by the route (and rejected by validate).
  const FIELDS = Object.freeze([
    "event_id", "type", "subject_id", "level", "source_type", "source_actor_id",
    "place_id", "story_id", "payload", "client_at", "save_version",
  ]);

  const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const bad = (reason) => ({ ok: false, reason });
  const isNil = (v) => v === undefined || v === null;

  function validRef(v) {
    if (isNil(v)) return true;
    return typeof v === "string" && v.length <= REF_MAX && REF_RE.test(v) && !UUID_RE.test(v);
  }

  // Rules per type. Returns null when the subject and source are acceptable, else a reason.
  function checkByType(ev) {
    if (ev.type === "discovery") {
      const m = /^disc:(.+)$/.exec(ev.subject_id);
      if (!m || !DISCOVER_IDS.includes(m[1])) return "not in catalog";
      if (ev.level === "heard") return ev.source_type === "report" ? null : "bad source_type for level";
      if (ev.level === "seen") return ev.source_type === "observation" ? null : "bad source_type for level";
      return "bad level for discovery";
    }
    if (ev.type === "milestone") {
      const m = /^ms:(.+)$/.exec(ev.subject_id);
      if (!m || !MILESTONE_ID_RE.test(m[1])) return "not in catalog";
      return ev.source_type === "observation" ? null : "bad source_type for milestone";
    }
    if (ev.type === "action") {
      return ev.subject_id === BACKFILL_SUBJECT ? null : "not in catalog";
    }
    return "not in catalog"; // report, world_change: reserved
  }

  // Checks one event object. role is accepted for callers that pass it; no MVP rule depends on it yet.
  function validate(ev, opts) {
    void opts;
    if (!isPlainObject(ev)) return bad("not an object");
    for (const k of Object.keys(ev)) if (!FIELDS.includes(k)) return bad("unknown field");
    if (typeof ev.event_id !== "string" || !EVENT_ID_RE.test(ev.event_id)) return bad("bad event_id");
    if (!TYPES.includes(ev.type)) return bad("bad type");
    if (RESERVED_TYPES.includes(ev.type)) return bad("not in catalog");
    // level (heard / seen / confirmed) belongs to discoveries only; milestones and actions carry none.
    if (ev.type === "discovery") { if (!LEVELS.includes(ev.level)) return bad("bad level"); }
    else if (!isNil(ev.level)) return bad("level only for discovery");
    if (!SOURCE_TYPES.includes(ev.source_type)) return bad("bad source_type");
    if (typeof ev.subject_id !== "string") return bad("bad subject_id");
    const typeProblem = checkByType(ev);
    if (typeProblem) return bad(typeProblem);
    for (const k of ["source_actor_id", "place_id", "story_id"]) {
      if (!validRef(ev[k])) return bad("bad " + k);
    }
    if (!isNil(ev.payload)) {
      if (!isPlainObject(ev.payload)) return bad("bad payload");
      const size = new TextEncoder().encode(JSON.stringify(ev.payload)).length;
      if (size > PAYLOAD_MAX_BYTES) return bad("payload too large");
    }
    if (!isNil(ev.client_at) && !(Number.isSafeInteger(ev.client_at) && ev.client_at >= 0 && ev.client_at <= CLIENT_AT_MAX)) {
      return bad("bad client_at");
    }
    if (!isNil(ev.save_version) && !(Number.isSafeInteger(ev.save_version) && ev.save_version >= 0 && ev.save_version <= SAVE_VERSION_MAX)) {
      return bad("bad save_version");
    }
    return { ok: true };
  }

  // Fills the optional fields with their stored defaults. Call only on an event that passed validate().
  function normalize(ev) {
    return {
      event_id: ev.event_id,
      type: ev.type,
      subject_id: ev.subject_id,
      level: isNil(ev.level) ? null : ev.level,
      source_type: ev.source_type,
      source_actor_id: isNil(ev.source_actor_id) ? null : ev.source_actor_id,
      place_id: isNil(ev.place_id) ? null : ev.place_id,
      story_id: isNil(ev.story_id) ? null : ev.story_id,
      payload: isNil(ev.payload) ? {} : ev.payload,
      client_at: isNil(ev.client_at) ? null : ev.client_at,
      save_version: isNil(ev.save_version) ? null : ev.save_version,
    };
  }

  const api = {
    TYPES, SOURCE_TYPES, LEVELS, RESERVED_TYPES, EVENT_ID_RE, MILESTONE_ID_RE, DISCOVER_IDS,
    BACKFILL_SUBJECT, FIELDS, PAYLOAD_MAX_BYTES,
    validate, normalize,
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.EventCatalog = api;
})();
