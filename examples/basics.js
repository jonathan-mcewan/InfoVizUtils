// basics.js — Getting started with infoVisUtils
// Run: node examples/basics.js

import u from "../infoVisUtils.js";

// --- Sample dataset: student quiz scores ---
const students = [
  { name: "Alice",   score: 92, grade: "A" },
  { name: "Bob",     score: 78, grade: "B" },
  { name: "Carol",   score: 85, grade: "B" },
  { name: "Dan",     score: 64, grade: "D" },
  { name: "Eve",     score: 91, grade: "A" },
  { name: "Frank",   score: 73, grade: "C" },
  { name: "Grace",   score: 88, grade: "B" },
  { name: "Hank",    score: 55, grade: "F" },
  { name: "Iris",    score: 97, grade: "A" },
  { name: "Jack",    score: 70, grade: "C" },
];

// Extract the scores column
const scores = u.unpack(students, "score");
console.log("Scores:", scores);

// Compute summary statistics
console.log("\n--- Summary Statistics ---");
console.log("Mean:       ", u.formatNumber(u.mean(scores)));
console.log("Median:     ", u.formatNumber(u.median(scores)));
console.log("Std Dev:    ", u.formatNumber(u.stdDev(scores)));
console.log("Extent:     ", u.extent(scores));
console.log("25th pctile:", u.formatNumber(u.percentile(scores, 25)));
console.log("75th pctile:", u.formatNumber(u.percentile(scores, 75)));

// Group by grade and compute per-group means
console.log("\n--- Mean Score by Grade ---");
const byGrade = u.groupBy(students, "grade");

const gradeSummary = Object.entries(byGrade).map(([grade, rows]) => ({
  grade,
  count: rows.length,
  mean: u.mean(u.unpack(rows, "score")),
}));

// Sort by grade letter
const sorted = u.sortBy(gradeSummary, "grade");

for (const row of sorted) {
  console.log(`  ${row.grade}: ${u.formatNumber(row.mean)} (n=${row.count})`);
}
