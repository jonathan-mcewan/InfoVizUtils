// infoVisUtils.js — Week 7 (Full Semester)
// Information Visualization Utilities

// ============================================================
// Statistics
// ============================================================

/**
 * Returns the arithmetic mean of an array of numbers.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The mean, or NaN if the array is empty
 */
function mean(arr) {
  if (arr.length === 0) return NaN;
  return sum(arr) / arr.length;
}

/**
 * Returns the median. For even-length arrays, returns the average of the two middle values.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The median, or NaN if the array is empty
 */
function median(arr) {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Returns the most frequent value. If there's a tie, returns the value that appears first in the array.
 * @param {number[]} arr - Array of values
 * @returns {*} The mode, or NaN if the array is empty
 */
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

/**
 * Returns the population standard deviation.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The standard deviation, or NaN if the array is empty
 */
function stdDev(arr) {
  return Math.sqrt(variance(arr));
}

/**
 * Returns the population variance.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The variance, or NaN if the array is empty
 */
function variance(arr) {
  if (arr.length === 0) return NaN;
  const m = mean(arr);
  return arr.reduce((acc, val) => acc + (val - m) ** 2, 0) / arr.length;
}

/**
 * Returns the p-th percentile (p from 0 to 100). Uses linear interpolation.
 * @param {number[]} arr - Array of numbers
 * @param {number} p - Percentile value between 0 and 100
 * @returns {number} The percentile value, or NaN if the array is empty
 */
function percentile(arr, p) {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const k = (p / 100) * (sorted.length - 1);
  const floor = Math.floor(k);
  const ceil = Math.ceil(k);
  if (floor === ceil) return sorted[floor];
  return sorted[floor] + (k - floor) * (sorted[ceil] - sorted[floor]);
}

/**
 * Returns the minimum value in an array.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The minimum value, or NaN if the array is empty
 */
function min(arr) {
  if (arr.length === 0) return NaN;
  return Math.min(...arr);
}

/**
 * Returns the maximum value in an array.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The maximum value, or NaN if the array is empty
 */
function max(arr) {
  if (arr.length === 0) return NaN;
  return Math.max(...arr);
}

/**
 * Returns the sum of all values in an array.
 * @param {number[]} arr - Array of numbers
 * @returns {number} The sum, or NaN if the array is empty
 */
function sum(arr) {
  if (arr.length === 0) return NaN;
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * Returns [min, max] as a two-element array.
 * @param {number[]} arr - Array of numbers
 * @returns {[number, number]} A two-element array [min, max], or [NaN, NaN] if the array is empty
 */
function extent(arr) {
  if (arr.length === 0) return [NaN, NaN];
  return [min(arr), max(arr)];
}

// ============================================================
// Rolling / Windowed
// ============================================================

/**
 * Returns a moving average. Output has the same length as the input.
 * The first windowSize - 1 values use partial windows (averaging over however many values are available).
 * @param {number[]} arr - Array of numbers
 * @param {number} windowSize - Size of the rolling window
 * @returns {number[]} Array of rolling averages with the same length as the input
 */
function rollingAverage(arr, windowSize) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = arr.slice(start, i + 1);
    result.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  return result;
}

/**
 * Returns a moving sum. Output has the same length as the input.
 * Same partial-window behavior as rollingAverage for the first elements.
 * @param {number[]} arr - Array of numbers
 * @param {number} windowSize - Size of the rolling window
 * @returns {number[]} Array of rolling sums with the same length as the input
 */
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

/**
 * Extracts a column from an array of objects. Essential for Plotly traces.
 * @param {Object[]} rows - Array of objects
 * @param {string} key - Property name to extract
 * @returns {*[]} Array of values for the given key
 */
function unpack(rows, key) {
  return rows.map((row) => row[key]);
}

/**
 * Groups rows by the value of a column. Returns an object where keys are group values.
 * @param {Object[]} rows - Array of objects
 * @param {string} key - Property name to group by
 * @returns {Object.<string, Object[]>} Object mapping group values to arrays of rows
 */
function groupBy(rows, key) {
  const groups = {};
  for (const row of rows) {
    const val = row[key];
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  }
  return groups;
}

/**
 * Returns a new sorted array of objects. Does not mutate the original.
 * @param {Object[]} rows - Array of objects
 * @param {string} key - Property name to sort by
 * @param {"asc"|"desc"} [order="asc"] - Sort order
 * @returns {Object[]} New sorted array
 */
function sortBy(rows, key, order = "asc") {
  return [...rows].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Returns unique values, preserving insertion order.
 * @param {*[]} arr - Array of values
 * @returns {*[]} Array of unique values
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Returns a frequency count as an object.
 * @param {*[]} arr - Array of values
 * @returns {Object.<string, number>} Object mapping values to their counts
 */
function counts(arr) {
  const result = {};
  for (const val of arr) {
    result[val] = (result[val] || 0) + 1;
  }
  return result;
}

/**
 * Scales values to [newMin, newMax] (default [0, 1]). If all values are identical, returns the midpoint.
 * @param {number[]} arr - Array of numbers
 * @param {number} [newMin=0] - Lower bound of the output range
 * @param {number} [newMax=1] - Upper bound of the output range
 * @returns {number[]} Array of normalized values
 */
function normalize(arr, newMin = 0, newMax = 1) {
  const lo = min(arr);
  const hi = max(arr);
  if (lo === hi) {
    const mid = (newMin + newMax) / 2;
    return arr.map(() => mid);
  }
  return arr.map((val) => newMin + ((val - lo) / (hi - lo)) * (newMax - newMin));
}

/**
 * Filters an array of objects using a predicate function.
 * @param {Object[]} rows - Array of objects
 * @param {function(Object): boolean} predicate - Filter function
 * @returns {Object[]} Filtered array
 */
function filterRows(rows, predicate) {
  return rows.filter(predicate);
}

// ============================================================
// Parsing Helpers
// ============================================================

/**
 * Automatically converts string columns to appropriate types. Returns new objects (does not mutate).
 * Conversion rules: numeric strings to numbers, ISO date strings to Date objects, empty strings to null.
 * @param {Object[]} rows - Array of objects with string values (e.g. from CSV)
 * @returns {Object[]} New array of objects with converted values
 */
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

/**
 * Parses a date column. Returns new objects (does not mutate). Without a format string, parses ISO 8601.
 * With a format string, supports tokens: YYYY, MM, DD, HH, mm, ss.
 * @param {Object[]} rows - Array of objects
 * @param {string} key - Property name of the date column
 * @param {string} [format] - Optional format string (e.g. "DD/MM/YYYY", "YYYY-MM-DD HH:mm")
 * @returns {Object[]} New array of objects with the date column parsed to Date objects
 */
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

/**
 * Parses a date string using a format template with positional tokens.
 * @param {string} str - Date string to parse
 * @param {string} format - Format template (tokens: YYYY, MM, DD, HH, mm, ss)
 * @returns {Date} Parsed Date object
 */
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

/**
 * Returns a function that maps values from the domain to the range using linear interpolation.
 * Extrapolates outside the domain.
 * @param {[number, number]} domain - Two-element array [domMin, domMax]
 * @param {[number, number]} range - Two-element array [ranMin, ranMax]
 * @returns {function(number): number} Scale function that maps a domain value to a range value
 */
function linearScale([domMin, domMax], [ranMin, ranMax]) {
  return function (value) {
    const t = (value - domMin) / (domMax - domMin);
    return ranMin + t * (ranMax - ranMin);
  };
}

/**
 * Returns a function that maps values to interpolated CSS hex colors.
 * Colors are evenly-spaced stops. Clamps to the first/last color outside the domain.
 * @param {[number, number]} domain - Two-element array [domMin, domMax]
 * @param {string[]} colors - Array of hex color strings (e.g. ["#0000ff", "#ff0000"])
 * @returns {function(number): string} Scale function that maps a domain value to a hex color string
 */
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

/**
 * Converts a hex color string to an RGB array.
 * @param {string} hex - Hex color string (e.g. "#ff0000")
 * @returns {[number, number, number]} RGB values as [r, g, b] (0–255)
 */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Converts RGB values to a hex color string.
 * @param {number} r - Red (0–255)
 * @param {number} g - Green (0–255)
 * @param {number} b - Blue (0–255)
 * @returns {string} Hex color string (e.g. "#ff0000")
 */
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("")
  );
}

/**
 * Creates equal-width histogram bins. The last bin is closed on both ends [min, max].
 * @param {number[]} arr - Array of numbers
 * @param {number} numBins - Number of bins
 * @returns {{min: number, max: number, count: number}[]} Array of bin objects, or [] if the array is empty
 */
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

/**
 * Locale-aware number formatting.
 * @param {number} n - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted number string (e.g. "1,234.50" in en-US locale)
 */
function formatNumber(n, decimals = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a decimal as a percentage string.
 * @param {number} n - Number to format (e.g. 0.75 becomes "75.00%")
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted percentage string
 */
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
