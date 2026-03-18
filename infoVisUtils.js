// infoVisUtils.js — Week 7 (Full Semester)
// Information Visualization Utilities

// ============================================================
// Statistics
// ============================================================

function mean(arr) {
  if (arr.length === 0) return NaN;
  return sum(arr) / arr.length;
}

function median(arr) {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(arr) {
  if (arr.length === 0) return NaN;
  const freq = new Map();
  for (const val of arr) {
    freq.set(val, (freq.get(val) || 0) + 1);
  }
  let bestVal = arr[0];
  let bestCount = 0;
  for (const val of arr) {
    const count = freq.get(val);
    if (count > bestCount) {
      bestCount = count;
      bestVal = val;
    }
  }
  return bestVal;
}

function stdDev(arr) {
  return Math.sqrt(variance(arr));
}

function variance(arr) {
  if (arr.length === 0) return NaN;
  const m = mean(arr);
  return arr.reduce((acc, val) => acc + (val - m) ** 2, 0) / arr.length;
}

function percentile(arr, p) {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const k = (p / 100) * (sorted.length - 1);
  const floor = Math.floor(k);
  const ceil = Math.ceil(k);
  if (floor === ceil) return sorted[floor];
  return sorted[floor] + (k - floor) * (sorted[ceil] - sorted[floor]);
}

function min(arr) {
  if (arr.length === 0) return NaN;
  return Math.min(...arr);
}

function max(arr) {
  if (arr.length === 0) return NaN;
  return Math.max(...arr);
}

function sum(arr) {
  if (arr.length === 0) return NaN;
  return arr.reduce((acc, val) => acc + val, 0);
}

function extent(arr) {
  if (arr.length === 0) return [NaN, NaN];
  return [min(arr), max(arr)];
}

// ============================================================
// Rolling / Windowed
// ============================================================

function rollingAverage(arr, windowSize) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = arr.slice(start, i + 1);
    result.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  return result;
}

function rollingSum(arr, windowSize) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = arr.slice(start, i + 1);
    result.push(window.reduce((a, b) => a + b, 0));
  }
  return result;
}

// ============================================================
// Data Wrangling
// ============================================================

function unpack(rows, key) {
  return rows.map((row) => row[key]);
}

function groupBy(rows, key) {
  const groups = {};
  for (const row of rows) {
    const val = row[key];
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  }
  return groups;
}

function sortBy(rows, key, order = "asc") {
  return [...rows].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

function unique(arr) {
  return [...new Set(arr)];
}

function counts(arr) {
  const result = {};
  for (const val of arr) {
    result[val] = (result[val] || 0) + 1;
  }
  return result;
}

function normalize(arr, newMin = 0, newMax = 1) {
  const lo = min(arr);
  const hi = max(arr);
  if (lo === hi) {
    const mid = (newMin + newMax) / 2;
    return arr.map(() => mid);
  }
  return arr.map((val) => newMin + ((val - lo) / (hi - lo)) * (newMax - newMin));
}

function filterRows(rows, predicate) {
  return rows.filter(predicate);
}

// ============================================================
// Parsing Helpers
// ============================================================

function autoType(rows) {
  return rows.map((row) => {
    const out = {};
    for (const [key, val] of Object.entries(row)) {
      if (val === "" || val === null || val === undefined) {
        out[key] = null;
      } else if (typeof val === "string") {
        // Try number
        const num = Number(val);
        if (val.trim() !== "" && !isNaN(num)) {
          out[key] = num;
        // Try ISO date
        } else if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
          const d = new Date(val);
          out[key] = isNaN(d.getTime()) ? val : d;
        } else {
          out[key] = val;
        }
      } else {
        out[key] = val;
      }
    }
    return out;
  });
}

function parseDates(rows, key, format) {
  return rows.map((row) => {
    const out = { ...row };
    const val = row[key];
    if (val == null) return out;

    if (!format) {
      // ISO 8601
      out[key] = new Date(val);
    } else {
      out[key] = parseFormatted(String(val), format);
    }
    return out;
  });
}

function parseFormatted(str, format) {
  const tokens = { YYYY: 0, MM: 1, DD: 1, HH: 0, mm: 0, ss: 0 };
  const parts = {};

  for (const token of Object.keys(tokens)) {
    const idx = format.indexOf(token);
    if (idx !== -1) {
      parts[token] = parseInt(str.substring(idx, idx + token.length), 10);
    } else {
      parts[token] = tokens[token];
    }
  }

  return new Date(
    parts.YYYY,
    parts.MM - 1,
    parts.DD,
    parts.HH,
    parts.mm,
    parts.ss
  );
}

// ============================================================
// Color / Scales
// ============================================================

function linearScale([domMin, domMax], [ranMin, ranMax]) {
  return function (value) {
    const t = (value - domMin) / (domMax - domMin);
    return ranMin + t * (ranMax - ranMin);
  };
}

function colorScale([domMin, domMax], colors) {
  return function (value) {
    const t = Math.max(0, Math.min(1, (value - domMin) / (domMax - domMin)));
    const segments = colors.length - 1;
    const segIdx = Math.min(Math.floor(t * segments), segments - 1);
    const segT = t * segments - segIdx;

    const c1 = hexToRgb(colors[segIdx]);
    const c2 = hexToRgb(colors[segIdx + 1]);

    const r = Math.round(c1[0] + segT * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + segT * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + segT * (c2[2] - c1[2]));

    return rgbToHex(r, g, b);
  };
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("")
  );
}

function bin(arr, numBins) {
  if (arr.length === 0) return [];
  const lo = min(arr);
  const hi = max(arr);
  const width = (hi - lo) / numBins;

  const bins = Array.from({ length: numBins }, (_, i) => ({
    min: lo + i * width,
    max: lo + (i + 1) * width,
    count: 0,
  }));

  for (const val of arr) {
    let idx = Math.floor((val - lo) / width);
    // Last bin is [min, max] (closed on both ends)
    if (idx >= numBins) idx = numBins - 1;
    bins[idx].count++;
  }

  return bins;
}

// ============================================================
// Annotation / Formatting
// ============================================================

function formatNumber(n, decimals = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatPercent(n, decimals = 2) {
  return (n * 100).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + "%";
}

// ============================================================
// Export
// ============================================================

const infoVisUtils = {
  // Statistics
  mean,
  median,
  mode,
  stdDev,
  variance,
  percentile,
  min,
  max,
  sum,
  extent,
  // Rolling / Windowed
  rollingAverage,
  rollingSum,
  // Data Wrangling
  unpack,
  groupBy,
  sortBy,
  unique,
  counts,
  normalize,
  filterRows,
  // Parsing Helpers
  autoType,
  parseDates,
  // Color / Scales
  linearScale,
  colorScale,
  bin,
  // Annotation / Formatting
  formatNumber,
  formatPercent,
};

export default infoVisUtils;
