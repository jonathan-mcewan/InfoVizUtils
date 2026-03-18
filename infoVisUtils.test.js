import { test } from "node:test";
import assert from "node:assert/strict";
import infoVisUtils from "./infoVisUtils.js";

// ============================================================
// Statistics
// ============================================================

test("mean — basic", () => {
  assert.strictEqual(infoVisUtils.mean([1, 2, 3, 4, 5]), 3);
});

test("mean — single element", () => {
  assert.strictEqual(infoVisUtils.mean([7]), 7);
});

test("mean — empty array", () => {
  assert.ok(isNaN(infoVisUtils.mean([])));
});

test("median — odd length", () => {
  assert.strictEqual(infoVisUtils.median([3, 1, 2]), 2);
});

test("median — even length", () => {
  assert.strictEqual(infoVisUtils.median([1, 2, 3, 4]), 2.5);
});

test("median — empty array", () => {
  assert.ok(isNaN(infoVisUtils.median([])));
});

test("mode — single mode", () => {
  assert.strictEqual(infoVisUtils.mode([1, 2, 2, 3]), 2);
});

test("mode — tie returns first in input", () => {
  assert.strictEqual(infoVisUtils.mode([3, 1, 1, 3]), 3);
});

test("mode — empty array", () => {
  assert.ok(isNaN(infoVisUtils.mode([])));
});

test("stdDev — basic", () => {
  const sd = infoVisUtils.stdDev([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.ok(Math.abs(sd - 2) < 0.001);
});

test("stdDev — empty array", () => {
  assert.ok(isNaN(infoVisUtils.stdDev([])));
});

test("variance — basic", () => {
  const v = infoVisUtils.variance([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.ok(Math.abs(v - 4) < 0.001);
});

test("percentile — 50th is median", () => {
  assert.strictEqual(infoVisUtils.percentile([1, 2, 3, 4, 5], 50), 3);
});

test("percentile — 0th and 100th", () => {
  assert.strictEqual(infoVisUtils.percentile([10, 20, 30], 0), 10);
  assert.strictEqual(infoVisUtils.percentile([10, 20, 30], 100), 30);
});

test("percentile — interpolation", () => {
  assert.strictEqual(infoVisUtils.percentile([1, 2, 3, 4], 25), 1.75);
});

test("percentile — empty array", () => {
  assert.ok(isNaN(infoVisUtils.percentile([], 50)));
});

test("min / max — basic", () => {
  assert.strictEqual(infoVisUtils.min([3, 1, 2]), 1);
  assert.strictEqual(infoVisUtils.max([3, 1, 2]), 3);
});

test("min / max — empty array", () => {
  assert.ok(isNaN(infoVisUtils.min([])));
  assert.ok(isNaN(infoVisUtils.max([])));
});

test("sum — basic", () => {
  assert.strictEqual(infoVisUtils.sum([1, 2, 3]), 6);
});

test("sum — empty array", () => {
  assert.ok(isNaN(infoVisUtils.sum([])));
});

test("extent — basic", () => {
  assert.deepStrictEqual(infoVisUtils.extent([3, 1, 4, 1, 5]), [1, 5]);
});

test("extent — empty array", () => {
  const [lo, hi] = infoVisUtils.extent([]);
  assert.ok(isNaN(lo));
  assert.ok(isNaN(hi));
});

// ============================================================
// Rolling / Windowed
// ============================================================

test("rollingAverage — basic", () => {
  const result = infoVisUtils.rollingAverage([1, 2, 3, 4, 5], 3);
  assert.strictEqual(result.length, 5);
  assert.strictEqual(result[0], 1);       // partial: [1]
  assert.strictEqual(result[1], 1.5);     // partial: [1,2]
  assert.strictEqual(result[2], 2);       // full: [1,2,3]
  assert.strictEqual(result[3], 3);       // full: [2,3,4]
  assert.strictEqual(result[4], 4);       // full: [3,4,5]
});

test("rollingSum — basic", () => {
  const result = infoVisUtils.rollingSum([1, 2, 3, 4, 5], 3);
  assert.strictEqual(result.length, 5);
  assert.strictEqual(result[0], 1);       // partial: [1]
  assert.strictEqual(result[1], 3);       // partial: [1,2]
  assert.strictEqual(result[2], 6);       // full: [1,2,3]
  assert.strictEqual(result[3], 9);       // full: [2,3,4]
  assert.strictEqual(result[4], 12);      // full: [3,4,5]
});

// ============================================================
// Data Wrangling
// ============================================================

test("unpack — extract column", () => {
  const rows = [{ name: "a", val: 1 }, { name: "b", val: 2 }];
  assert.deepStrictEqual(infoVisUtils.unpack(rows, "val"), [1, 2]);
});

test("unpack — empty", () => {
  assert.deepStrictEqual(infoVisUtils.unpack([], "x"), []);
});

test("groupBy — basic", () => {
  const rows = [
    { cat: "A", v: 1 },
    { cat: "B", v: 2 },
    { cat: "A", v: 3 },
  ];
  const groups = infoVisUtils.groupBy(rows, "cat");
  assert.strictEqual(groups["A"].length, 2);
  assert.strictEqual(groups["B"].length, 1);
});

test("sortBy — ascending", () => {
  const rows = [{ v: 3 }, { v: 1 }, { v: 2 }];
  const sorted = infoVisUtils.sortBy(rows, "v");
  assert.deepStrictEqual(
    sorted.map((r) => r.v),
    [1, 2, 3]
  );
});

test("sortBy — descending", () => {
  const rows = [{ v: 3 }, { v: 1 }, { v: 2 }];
  const sorted = infoVisUtils.sortBy(rows, "v", "desc");
  assert.deepStrictEqual(
    sorted.map((r) => r.v),
    [3, 2, 1]
  );
});

test("sortBy — does not mutate", () => {
  const rows = [{ v: 3 }, { v: 1 }];
  const sorted = infoVisUtils.sortBy(rows, "v");
  assert.notStrictEqual(sorted, rows);
  assert.strictEqual(rows[0].v, 3);
});

test("unique — basic", () => {
  assert.deepStrictEqual(infoVisUtils.unique([1, 2, 2, 3, 1]), [1, 2, 3]);
});

test("unique — empty", () => {
  assert.deepStrictEqual(infoVisUtils.unique([]), []);
});

test("counts — basic", () => {
  assert.deepStrictEqual(infoVisUtils.counts(["a", "b", "a", "c", "a"]), {
    a: 3,
    b: 1,
    c: 1,
  });
});

test("normalize — 0 to 1", () => {
  const result = infoVisUtils.normalize([0, 5, 10]);
  assert.deepStrictEqual(result, [0, 0.5, 1]);
});

test("normalize — custom range", () => {
  const result = infoVisUtils.normalize([0, 5, 10], 100, 200);
  assert.deepStrictEqual(result, [100, 150, 200]);
});

test("normalize — constant array returns midpoint", () => {
  const result = infoVisUtils.normalize([5, 5, 5]);
  assert.deepStrictEqual(result, [0.5, 0.5, 0.5]);
});

test("filterRows — basic", () => {
  const rows = [{ v: 1 }, { v: 2 }, { v: 3 }];
  const filtered = infoVisUtils.filterRows(rows, (r) => r.v > 1);
  assert.strictEqual(filtered.length, 2);
});

// ============================================================
// Parsing Helpers
// ============================================================

test("autoType — converts numbers and dates", () => {
  const rows = [{ a: "42", b: "hello", c: "2024-01-15", d: "" }];
  const typed = infoVisUtils.autoType(rows);
  assert.strictEqual(typed[0].a, 42);
  assert.strictEqual(typed[0].b, "hello");
  assert.ok(typed[0].c instanceof Date);
  assert.strictEqual(typed[0].d, null);
});

test("autoType — does not mutate", () => {
  const rows = [{ a: "42" }];
  infoVisUtils.autoType(rows);
  assert.strictEqual(rows[0].a, "42");
});

test("parseDates — ISO 8601", () => {
  const rows = [{ date: "2024-06-15" }];
  const parsed = infoVisUtils.parseDates(rows, "date");
  assert.ok(parsed[0].date instanceof Date);
  assert.strictEqual(parsed[0].date.getFullYear(), 2024);
});

test("parseDates — custom format", () => {
  const rows = [{ date: "15/06/2024" }];
  const parsed = infoVisUtils.parseDates(rows, "date", "DD/MM/YYYY");
  assert.ok(parsed[0].date instanceof Date);
  assert.strictEqual(parsed[0].date.getFullYear(), 2024);
  assert.strictEqual(parsed[0].date.getMonth(), 5); // June = 5
  assert.strictEqual(parsed[0].date.getDate(), 15);
});

test("parseDates — does not mutate", () => {
  const rows = [{ date: "2024-01-01" }];
  infoVisUtils.parseDates(rows, "date");
  assert.strictEqual(rows[0].date, "2024-01-01");
});

// ============================================================
// Color / Scales
// ============================================================

test("linearScale — basic mapping", () => {
  const scale = infoVisUtils.linearScale([0, 100], [0, 1]);
  assert.strictEqual(scale(0), 0);
  assert.strictEqual(scale(50), 0.5);
  assert.strictEqual(scale(100), 1);
});

test("linearScale — extrapolates outside domain", () => {
  const scale = infoVisUtils.linearScale([0, 100], [0, 1]);
  assert.strictEqual(scale(200), 2);
  assert.strictEqual(scale(-100), -1);
});

test("colorScale — two-color gradient", () => {
  const scale = infoVisUtils.colorScale([0, 100], ["#000000", "#ffffff"]);
  assert.strictEqual(scale(0), "#000000");
  assert.strictEqual(scale(100), "#ffffff");
  assert.strictEqual(scale(50), "#808080");
});

test("colorScale — clamps outside domain", () => {
  const scale = infoVisUtils.colorScale([0, 100], ["#000000", "#ffffff"]);
  assert.strictEqual(scale(-50), "#000000");
  assert.strictEqual(scale(200), "#ffffff");
});

test("colorScale — three colors", () => {
  const scale = infoVisUtils.colorScale([0, 100], ["#ff0000", "#00ff00", "#0000ff"]);
  assert.strictEqual(scale(0), "#ff0000");
  assert.strictEqual(scale(50), "#00ff00");
  assert.strictEqual(scale(100), "#0000ff");
});

test("bin — basic binning", () => {
  const result = infoVisUtils.bin([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].count + result[1].count, 10);
  assert.strictEqual(result[0].min, 1);
  assert.strictEqual(result[1].max, 10);
});

test("bin — value on boundary goes to correct bin", () => {
  const result = infoVisUtils.bin([0, 5, 10], 2);
  // 0 → bin 0, 5 → bin 1, 10 → bin 1 (last bin closed)
  assert.strictEqual(result[0].count, 1);
  assert.strictEqual(result[1].count, 2);
});

test("bin — empty array", () => {
  assert.deepStrictEqual(infoVisUtils.bin([], 5), []);
});

// ============================================================
// Annotation / Formatting
// ============================================================

test("formatNumber — default 2 decimals", () => {
  const result = infoVisUtils.formatNumber(1234.5);
  // Locale-dependent — may have thousands separator
  assert.ok(result.includes("234"));
  assert.ok(result.includes("50"));
});

test("formatNumber — custom decimals", () => {
  const result = infoVisUtils.formatNumber(3.14159, 3);
  assert.ok(result.includes("3.142") || result.includes("3,142"));
});

test("formatPercent — basic", () => {
  const result = infoVisUtils.formatPercent(0.75);
  assert.ok(result.includes("75"));
  assert.ok(result.includes("%"));
});

test("formatPercent — custom decimals", () => {
  const result = infoVisUtils.formatPercent(0.1234, 1);
  assert.ok(result.includes("12"));
  assert.ok(result.includes("%"));
});
