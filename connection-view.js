// Pure logic for saved connections ("Giữ kết nối" / "Quen"): the level, the connect decision and the
// list the owner sees. No I/O and no clock of its own: the caller passes rows, the online check and now.
// Nothing here puts an internal character or user id in the output.
const { MAX_CONNECTIONS } = require("./store");

// pair: { iSaved, theySaved }. "quen" when both saved, "luu" when only I did, "moi" when only they did.
function levelOf(pair) {
  if (pair.iSaved && pair.theySaved) return "quen";
  if (pair.iSaved) return "luu";
  if (pair.theySaved) return "moi";
  return null;
}

// Decides whether a POST /api/connect may go through.
//   sameAccount: target belongs to the caller's account
//   blocked:     either account blocked the other
//   hasEncounter: a "Từng gặp" row exists between the two characters, in either direction
//   pair:        { iSaved, theySaved } before the call
//   savedCount:  how many connections the caller's character already saved
// Returns { ok: true, already } or { ok: false, status, error }.
function connectDecision({ sameAccount, blocked, hasEncounter, pair, savedCount }) {
  if (sameAccount) return { ok: false, status: 400, error: "that is your own character" };
  // Same answer as an unknown handle, so a block is not revealed.
  if (blocked) return { ok: false, status: 404, error: "not found" };
  if (pair.iSaved) return { ok: true, already: true };
  if (!hasEncounter) return { ok: false, status: 400, error: "not met yet" };
  if (savedCount >= MAX_CONNECTIONS) return { ok: false, status: 400, error: "too many connections" };
  return { ok: true, already: false };
}

// Builds the list for one owner.
//   rows: from store.listConnections(ownCharId)
//   opts.isOnline(otherCharId) -> boolean, called only for mutual, unhidden people
//   opts.now: ms, used as lastSeenAt for someone who is online right now
//   opts.blockedUserIds: Set of account ids to leave out (either direction)
//   opts.ownUserId: the caller's account id; rows pointing at it are left out
// status is null unless the level is "quen" AND the other character has hide_status false.
// Sort: mutual and online, then mutual by lastSeenAt, then "luu", then "moi" (newest first in each group).
// For a mutual person whose status is hidden, the sort uses savedAt, so hidden status cannot be read from order.
function buildConnectionList(rows, opts = {}) {
  const isOnline = typeof opts.isOnline === "function" ? opts.isOnline : () => false;
  const now = Number.isFinite(opts.now) ? opts.now : Date.now();
  const blocked = opts.blockedUserIds instanceof Set ? opts.blockedUserIds : new Set();
  const out = [];
  for (const r of Array.isArray(rows) ? rows : []) {
    if (!r || !r.handle) continue;
    if (opts.ownUserId && r.otherUserId === opts.ownUserId) continue;
    if (blocked.has(r.otherUserId)) continue;
    const level = levelOf(r);
    if (!level) continue;
    // An archived (story_completed) person is never online and has no status; it sorts like a hidden-status row.
    const archived = !!r.archived;
    let status = null;
    let rank;
    let key;
    if (level === "quen" && !r.hideStatus && !archived) {
      const online = !!isOnline(r.otherCharId);
      status = { online, lastSeenAt: online ? now : (r.lastSeenAt ?? null) };
      rank = online ? 0 : 1;
      key = status.lastSeenAt ?? -Infinity;
    } else if (level === "quen") {
      rank = 1;
      key = r.savedAt;
    } else {
      rank = level === "luu" ? 2 : 3;
      key = r.savedAt;
    }
    out.push({
      rank,
      key: Number.isFinite(key) ? key : -Infinity,
      item: { handle: r.handle, name: r.name, role: r.role, hidden: !!r.hideProfile, level, status, ...(archived ? { archived: true } : {}) },
    });
  }
  out.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.key === b.key) return 0;
    return a.key < b.key ? 1 : -1;
  });
  return out.map((x) => x.item);
}

module.exports = { levelOf, connectDecision, buildConnectionList };
