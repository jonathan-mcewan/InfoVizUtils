# infoVisUtils.js — Design Spec

## Context

This library serves an information visualization course where students are comfortable with JavaScript but learning data viz with D3.js and Plotly.js. Students currently lack a shared utility library for common operations (statistical calculations, data wrangling, color scales, formatting). The instructor introduces functions in tutorials each week and provides an updated library file — a strict superset of the previous week — so existing student code never breaks.

## Deliverables

Each weekly release consists of:

1. **`infoVisUtils.js`** — the library (native ES module, single file, no dependencies)
2. **`infoVisUtils-reference.md`** — companion documentation with:
   - "What's New in Week N" section listing new functions with examples
   - Full API Reference organized by category
3. **`infoVisUtils.test.js`** — test suite (instructor-only, not distributed to students)

## API Design

### Import Pattern

Single default export — a namespace object:

```js
import infoVisUtils from './infoVisUtils.js';

const avg = infoVisUtils.mean([1, 2, 3, 4, 5]);
const temps = infoVisUtils.unpack(rows, 'temperature');
```

This mirrors the `Math.max()` pattern students already know.

### File Structure

```js
// infoVisUtils.js — Week N
// Information Visualization Utilities

// ---- Statistics ----
function mean(arr) { /* ... */ }
// ... more functions ...

// ---- Export ----
const infoVisUtils = { mean, median, /* ... */ };
export default infoVisUtils;
```

Functions are defined as plain named functions, then collected into the export object at the bottom. New weeks append functions and add them to the object.

### Function Inventory

#### Statistics
| Function | Signature | Description |
|----------|-----------|-------------|
| `mean` | `(arr) → number` | Arithmetic mean |
| `median` | `(arr) → number` | Median value (average of two middle values if even-length) |
| `mode` | `(arr) → value` | Most frequent value. If tied, returns the value appearing first in the input array |
| `stdDev` | `(arr) → number` | Population standard deviation |
| `variance` | `(arr) → number` | Population variance |
| `percentile` | `(arr, p) → number` | p-th percentile (p in 0–100). Uses linear interpolation (matches Excel `PERCENTILE.INC`) |
| `min` | `(arr) → number` | Minimum value |
| `max` | `(arr) → number` | Maximum value |
| `sum` | `(arr) → number` | Sum of values |
| `extent` | `(arr) → [min, max]` | Returns [min, max] pair |

#### Rolling / Windowed
| Function | Signature | Description |
|----------|-----------|-------------|
| `rollingAverage` | `(arr, windowSize) → number[]` | Moving average. Output length = `arr.length`. First `windowSize - 1` entries use partial windows (average of available values). |
| `rollingSum` | `(arr, windowSize) → number[]` | Moving sum. Same partial-window behavior as `rollingAverage`. |

#### Data Wrangling
| Function | Signature | Description |
|----------|-----------|-------------|
| `unpack` | `(rows, key) → any[]` | Extract a column from array of objects |
| `groupBy` | `(rows, key) → { [groupVal]: rows[] }` | Group rows by column value |
| `sortBy` | `(rows, key, order?) → rows[]` | Sort objects by key. `order`: `'asc'` (default) or `'desc'`. Returns a new array (does not mutate). |
| `unique` | `(arr) → any[]` | Unique values (preserves insertion order). Uses `Set` semantics. |
| `counts` | `(arr) → { [value]: number }` | Frequency count |
| `normalize` | `(arr, newMin?, newMax?) → number[]` | Scale to [0,1] or [newMin, newMax]. If all values are identical, returns array of `0.5` (or midpoint of custom range). |
| `filterRows` | `(rows, predicate) → rows[]` | Filter array of objects by predicate function |

#### Parsing Helpers
| Function | Signature | Description |
|----------|-----------|-------------|
| `autoType` | `(rows) → rows[]` | Convert string columns to numbers/dates where possible. Returns new objects (no mutation). Handles: numeric strings → numbers, ISO date strings → Date objects, empty strings → null. |
| `parseDates` | `(rows, key, format?) → rows[]` | Parse a date column. Returns new objects. Without format: parses ISO 8601. With format: supports tokens `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss` only. |

#### Color / Scales
| Function | Signature | Description |
|----------|-----------|-------------|
| `linearScale` | `([domMin, domMax], [ranMin, ranMax]) → fn(value)` | Returns a linear mapping function. Extrapolates outside domain (like D3 default). |
| `colorScale` | `([domMin, domMax], [color1, color2, ...]) → fn(value)` | Returns a function mapping values to interpolated CSS hex colors. Domain is continuous [min, max]. Colors are evenly-spaced stops. Interpolation in RGB space. Clamps to first/last color outside domain. |
| `bin` | `(arr, numBins) → { min, max, count }[]` | Equal-width histogram binning. Bins are half-open `[min, max)` except the last bin which is `[min, max]`. |

#### Annotation / Formatting
| Function | Signature | Description |
|----------|-----------|-------------|
| `formatNumber` | `(n, decimals?) → string` | Locale-aware number formatting. Default decimals: 2. |
| `formatPercent` | `(n, decimals?) → string` | Format as percentage string (e.g., `0.75` → `"75.00%"`). Default decimals: 2. |

## Semantic Conventions

- **No mutation**: All functions that accept arrays/objects return new arrays/objects. Original data is never modified.
- **Empty arrays**: Statistical functions return `NaN` for empty arrays. `unpack`, `unique`, `filterRows` etc. return `[]`.
- **No input validation**: Functions do not validate input types. Behavior on invalid input (non-arrays, wrong types) is undefined. This keeps the library simple and avoids hiding bugs in student code.
- **Equality**: `unique` and `counts` use `Set` / strict `===` semantics for primitives.

## Versioning Contract

- **Strict superset**: each week's file only adds functions. No renames, no signature changes, no removals.
- The export object at the bottom grows each week.
- The reference doc accumulates "What's New" sections while keeping the full reference current.

## Testing Strategy

Using Node.js built-in test runner (`node:test`) — zero dependencies:

```js
import { test } from 'node:test';
import assert from 'node:assert';
import infoVisUtils from './infoVisUtils.js';

test('mean computes arithmetic mean', () => {
  assert.strictEqual(infoVisUtils.mean([1, 2, 3]), 2);
});
```

Run with: `node --test infoVisUtils.test.js`

Each function gets at least:
- A basic happy-path test
- An edge case test (empty array, single element, etc.)

## Implementation Notes

- No external dependencies — everything is vanilla JS
- `linearScale` and `colorScale` return closures — this is a teaching opportunity for higher-order functions
- Color interpolation in `colorScale` works in RGB space for simplicity (parse hex → interpolate channels → format hex)

## Weekly Release Cadence

The full inventory above represents the end-of-semester state. In practice, functions are introduced a few at a time:

- **Week 1**: `mean`, `median`, `sum`, `min`, `max`, `extent`, `unpack`
- **Week 2**: `mode`, `stdDev`, `variance`, `percentile`
- **Week 3**: `rollingAverage`, `rollingSum`
- **Week 4**: `groupBy`, `sortBy`, `unique`, `counts`, `filterRows`
- **Week 5**: `normalize`, `autoType`, `parseDates`
- **Week 6**: `linearScale`, `colorScale`, `bin`
- **Week 7**: `formatNumber`, `formatPercent`

(This cadence is a suggestion — the instructor adjusts to match the syllabus.)
