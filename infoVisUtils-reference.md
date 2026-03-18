# infoVisUtils.js — API Reference

## Quick Start

```js
import infoVisUtils from './infoVisUtils.js';

const avg = infoVisUtils.mean([1, 2, 3, 4, 5]);     // 3
const temps = infoVisUtils.unpack(rows, 'temperature'); // [22, 24, 19, ...]
```

---

## What's New

### Week 7: Formatting
- `formatNumber(n, decimals?)` — locale-aware number formatting
- `formatPercent(n, decimals?)` — format as percentage

### Week 6: Scales & Binning
- `linearScale(domain, range)` — create a linear mapping function
- `colorScale(domain, colors)` — create a color interpolation function
- `bin(arr, numBins)` — histogram binning

### Week 5: Normalization & Parsing
- `normalize(arr, newMin?, newMax?)` — scale values to a range
- `autoType(rows)` — auto-convert string columns to numbers/dates
- `parseDates(rows, key, format?)` — parse a date column

### Week 4: Data Wrangling
- `groupBy(rows, key)` — group rows by column value
- `sortBy(rows, key, order?)` — sort array of objects
- `unique(arr)` — unique values
- `counts(arr)` — frequency count
- `filterRows(rows, predicate)` — filter array of objects

### Week 3: Rolling Calculations
- `rollingAverage(arr, windowSize)` — moving average
- `rollingSum(arr, windowSize)` — moving sum

### Week 2: More Statistics
- `mode(arr)` — most frequent value
- `stdDev(arr)` — standard deviation
- `variance(arr)` — variance
- `percentile(arr, p)` — percentile

### Week 1: Basics
- `mean(arr)`, `median(arr)`, `sum(arr)`, `min(arr)`, `max(arr)`, `extent(arr)`
- `unpack(rows, key)` — extract a column

---

## Full API Reference

### Statistics

#### `mean(arr)`
Returns the arithmetic mean.
```js
infoVisUtils.mean([1, 2, 3, 4, 5]); // 3
```

#### `median(arr)`
Returns the median. For even-length arrays, returns the average of the two middle values.
```js
infoVisUtils.median([3, 1, 4, 1, 5]); // 3
infoVisUtils.median([1, 2, 3, 4]);     // 2.5
```

#### `mode(arr)`
Returns the most frequent value. If there's a tie, returns the value that appears first in the array.
```js
infoVisUtils.mode([1, 2, 2, 3]); // 2
infoVisUtils.mode([3, 1, 1, 3]); // 3 (3 appears first)
```

#### `stdDev(arr)`
Returns the population standard deviation.
```js
infoVisUtils.stdDev([2, 4, 4, 4, 5, 5, 7, 9]); // 2
```

#### `variance(arr)`
Returns the population variance.
```js
infoVisUtils.variance([2, 4, 4, 4, 5, 5, 7, 9]); // 4
```

#### `percentile(arr, p)`
Returns the p-th percentile (p from 0 to 100). Uses linear interpolation.
```js
infoVisUtils.percentile([1, 2, 3, 4, 5], 50); // 3
infoVisUtils.percentile([1, 2, 3, 4], 25);    // 1.75
```

#### `min(arr)` / `max(arr)`
Returns the minimum or maximum value.
```js
infoVisUtils.min([3, 1, 2]); // 1
infoVisUtils.max([3, 1, 2]); // 3
```

#### `sum(arr)`
Returns the sum of all values.
```js
infoVisUtils.sum([1, 2, 3]); // 6
```

#### `extent(arr)`
Returns `[min, max]` as a two-element array.
```js
infoVisUtils.extent([3, 1, 4, 1, 5]); // [1, 5]
```

---

### Rolling / Windowed

#### `rollingAverage(arr, windowSize)`
Returns a moving average. Output has the same length as the input. The first `windowSize - 1` values use partial windows (averaging over however many values are available).
```js
infoVisUtils.rollingAverage([1, 2, 3, 4, 5], 3);
// [1, 1.5, 2, 3, 4]
```

#### `rollingSum(arr, windowSize)`
Returns a moving sum. Same partial-window behavior as `rollingAverage`.
```js
infoVisUtils.rollingSum([1, 2, 3, 4, 5], 3);
// [1, 3, 6, 9, 12]
```

---

### Data Wrangling

#### `unpack(rows, key)`
Extracts a column from an array of objects. Essential for Plotly traces.
```js
const rows = [{ name: "A", val: 10 }, { name: "B", val: 20 }];
infoVisUtils.unpack(rows, "val"); // [10, 20]
```

#### `groupBy(rows, key)`
Groups rows by the value of a column. Returns an object where keys are group values.
```js
const rows = [
  { cat: "X", v: 1 },
  { cat: "Y", v: 2 },
  { cat: "X", v: 3 },
];
infoVisUtils.groupBy(rows, "cat");
// { X: [{ cat: "X", v: 1 }, { cat: "X", v: 3 }], Y: [{ cat: "Y", v: 2 }] }
```

#### `sortBy(rows, key, order?)`
Returns a new sorted array. Does not mutate the original. `order` is `"asc"` (default) or `"desc"`.
```js
infoVisUtils.sortBy([{ v: 3 }, { v: 1 }], "v");        // [{ v: 1 }, { v: 3 }]
infoVisUtils.sortBy([{ v: 3 }, { v: 1 }], "v", "desc"); // [{ v: 3 }, { v: 1 }]
```

#### `unique(arr)`
Returns unique values, preserving insertion order.
```js
infoVisUtils.unique([1, 2, 2, 3, 1]); // [1, 2, 3]
```

#### `counts(arr)`
Returns a frequency count as an object.
```js
infoVisUtils.counts(["a", "b", "a", "c", "a"]);
// { a: 3, b: 1, c: 1 }
```

#### `normalize(arr, newMin?, newMax?)`
Scales values to `[0, 1]` by default, or to `[newMin, newMax]`. If all values are identical, returns the midpoint.
```js
infoVisUtils.normalize([0, 5, 10]);          // [0, 0.5, 1]
infoVisUtils.normalize([0, 5, 10], 100, 200); // [100, 150, 200]
```

#### `filterRows(rows, predicate)`
Filters an array of objects using a predicate function.
```js
infoVisUtils.filterRows(rows, (r) => r.value > 100);
```

---

### Parsing Helpers

#### `autoType(rows)`
Automatically converts string columns to appropriate types. Returns new objects (does not mutate the original).
- Numeric strings → numbers
- ISO date strings → Date objects
- Empty strings → `null`

```js
const raw = [{ temp: "22.5", date: "2024-01-15", city: "Melbourne" }];
const typed = infoVisUtils.autoType(raw);
// typed[0].temp === 22.5 (number)
// typed[0].date instanceof Date (true)
// typed[0].city === "Melbourne" (unchanged)
```

#### `parseDates(rows, key, format?)`
Parses a date column. Returns new objects. Without a format string, parses ISO 8601. With a format string, supports these tokens: `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`.
```js
infoVisUtils.parseDates(rows, "date");                     // ISO 8601
infoVisUtils.parseDates(rows, "date", "DD/MM/YYYY");       // 15/06/2024
infoVisUtils.parseDates(rows, "date", "YYYY-MM-DD HH:mm"); // 2024-06-15 14:30
```

---

### Color / Scales

#### `linearScale([domMin, domMax], [ranMin, ranMax])`
Returns a function that maps values from the domain to the range using linear interpolation. Extrapolates outside the domain.
```js
const scale = infoVisUtils.linearScale([0, 100], [0, 1]);
scale(50);  // 0.5
scale(200); // 2 (extrapolated)
```

#### `colorScale([domMin, domMax], [color1, color2, ...])`
Returns a function that maps values to interpolated CSS hex colors. Colors are evenly-spaced stops. Clamps to the first/last color outside the domain.
```js
const heat = infoVisUtils.colorScale([0, 100], ["#0000ff", "#ff0000"]);
heat(0);   // "#0000ff" (blue)
heat(50);  // "#800080" (purple)
heat(100); // "#ff0000" (red)

// Three-stop gradient
const traffic = infoVisUtils.colorScale([0, 100], ["#ff0000", "#ffff00", "#00ff00"]);
```

#### `bin(arr, numBins)`
Creates equal-width histogram bins. Returns an array of `{ min, max, count }` objects.
```js
infoVisUtils.bin([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2);
// [{ min: 1, max: 5.5, count: 5 }, { min: 5.5, max: 10, count: 5 }]
```

---

### Formatting

#### `formatNumber(n, decimals?)`
Locale-aware number formatting. Default: 2 decimal places.
```js
infoVisUtils.formatNumber(1234.5);    // "1,234.50" (in en-US locale)
infoVisUtils.formatNumber(3.14159, 3); // "3.142"
```

#### `formatPercent(n, decimals?)`
Formats a decimal as a percentage string. Default: 2 decimal places.
```js
infoVisUtils.formatPercent(0.75);    // "75.00%"
infoVisUtils.formatPercent(0.1234, 1); // "12.3%"
```

---

## Conventions

- **No mutation**: All functions return new arrays/objects. Your original data is never modified.
- **Empty arrays**: Statistical functions return `NaN` for empty arrays. Wrangling functions return `[]`.
- All functions assume valid input (arrays of numbers, arrays of objects, etc.).
