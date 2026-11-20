// Character save versions and migrations. Pure: no storage, no network, no account keys.
// kv is the per-character key/value map used by save.js (dhutanga.mind, dhutanga.history, dhutanga.progress, dhutanga.v).
// Legacy saves have no version and count as 1. Each step only moves one version forward and never deletes a key.
window.Migrate = (() => {
  const CURRENT = 2;
  const VKEY = "dhutanga.v";

  // Parse a version stored as a string or number; anything that is not an integer >= 1 counts as legacy (1).
  function version(kv) {
    const raw = kv ? kv[VKEY] : undefined;
    const n = typeof raw === "number" ? raw : (typeof raw === "string" && /^\s*\d+\s*$/.test(raw) ? Number(raw) : NaN);
    return Number.isInteger(n) && n >= 1 ? n : 1;
  }

  // steps[from] moves a kv from version `from` to `to`. Step 1 -> 2 only stamps the version;
  // real data changes come later through the event log, so mind/history/progress are not rewritten here.
  const steps = {
    1: { to: 2, name: "1->2 stamp version", run(kv) { kv[VKEY] = "2"; } },
  };

  // Returns { kv, from, to, changed, future, steps }. kv is a new object unless the save is newer than CURRENT,
  // in which case the input is returned as is (never downgrade or alter newer data).
  function upgrade(kv) {
    const input = kv || {};
    const from = version(input);
    if (from > CURRENT) return { kv: input, from, to: from, changed: false, future: true, steps: [] };
    const out = { ...input };
    const ran = [];
    let v = from;
    while (v < CURRENT) {
      const s = steps[v];
      if (!s) break;
      s.run(out);
      ran.push(s.name);
      v = s.to;
    }
    return { kv: out, from, to: v, changed: ran.length > 0, future: false, steps: ran };
  }

  return { CURRENT, version, upgrade };
})();
