// scales-and-color.js — Visual-prep functions demo
// Run: node examples/scales-and-color.js

import u from "../infoVisUtils.js";

// --- Sample dataset: daily high temperatures (°F) ---
const temps = [32, 45, 51, 58, 67, 72, 78, 85, 91, 88, 74, 60, 48, 35];

console.log("Temperatures:", temps);
console.log("Extent:      ", u.extent(temps));

// Normalize to 0–1
const norm = u.normalize(temps);
console.log("\nNormalized:  ", norm.map((v) => u.formatNumber(v, 3)));

// Create a cold-to-hot color scale (blue → yellow → red)
const [lo, hi] = u.extent(temps);
const heat = u.colorScale([lo, hi], ["#0000ff", "#ffff00", "#ff0000"]);

console.log("\n--- Temperature → Color ---");
for (let i = 0; i < temps.length; i++) {
  console.log(`  ${u.formatNumber(temps[i], 0).padStart(3)}°F  →  ${heat(temps[i])}`);
}

// Create a linear scale for positioning (e.g. pixel coordinates)
const xScale = u.linearScale([0, temps.length - 1], [0, 800]);
console.log("\n--- Index → X Position ---");
console.log(`  First: ${u.formatNumber(xScale(0), 0)}px`);
console.log(`  Mid:   ${u.formatNumber(xScale(6), 0)}px`);
console.log(`  Last:  ${u.formatNumber(xScale(temps.length - 1), 0)}px`);

// Bin into a histogram and print an ASCII bar chart
const bins = u.bin(temps, 5);
const maxCount = u.max(bins.map((b) => b.count));

console.log("\n--- Histogram (5 bins) ---");
for (const b of bins) {
  const bar = "█".repeat(Math.round((b.count / maxCount) * 30));
  console.log(
    `  ${u.formatNumber(b.min, 1).padStart(6)} – ${u.formatNumber(b.max, 1).padStart(6)}  |${bar} ${b.count}`
  );
}
