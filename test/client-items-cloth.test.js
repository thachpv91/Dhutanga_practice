const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

test("the picked-up cloth is a real item with art and a short story", () => {
  const sb = makeSandbox();
  load(sb, "items.js");
  const d = sb.Items.def("manh_vai_cu");
  assert.ok(d, "defined");
  assert.equal(d.name, "Mảnh vải cũ");
  assert.ok(d.desc && d.from && d.use);
  assert.ok(sb.Items.def("y_mau_dat"), "the finished robe still exists");
});
