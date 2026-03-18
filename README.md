# infoVisUtils

Zero-dependency utility library for information visualization courses.

## Quick Start

```js
import u from "./infoVisUtils.js";

const scores = u.unpack(students, "score");
const avg = u.mean(scores);                 // 79.3
console.log(u.formatNumber(avg));           // "79.30"
```

## Install

**Copy** `infoVisUtils.js` into your project and import it directly:

```js
import u from "./infoVisUtils.js";
```

Or install via npm:

```bash
npm install infovizutils
```

> ES module — your `package.json` needs `"type": "module"`, or use the `.mjs` extension.

## API at a Glance

See [infoVisUtils-reference.md](infoVisUtils-reference.md) for full details and examples.

### Statistics

| Function | Description |
|----------|-------------|
| `mean(arr)` | Arithmetic mean |
| `median(arr)` | Median (averages two middle values for even-length arrays) |
| `mode(arr)` | Most frequent value (ties: first appearing) |
| `stdDev(arr)` | Population standard deviation |
| `variance(arr)` | Population variance |
| `percentile(arr, p)` | p-th percentile (0–100) with linear interpolation |
| `min(arr)` / `max(arr)` | Minimum / maximum value |
| `sum(arr)` | Sum of all values |
| `extent(arr)` | `[min, max]` as a two-element array |

### Rolling / Windowed

| Function | Description |
|----------|-------------|
| `rollingAverage(arr, windowSize)` | Moving average (partial windows for first elements) |
| `rollingSum(arr, windowSize)` | Moving sum (partial windows for first elements) |

### Data Wrangling

| Function | Description |
|----------|-------------|
| `unpack(rows, key)` | Extract a column from an array of objects |
| `groupBy(rows, key)` | Group rows by column value |
| `sortBy(rows, key, order?)` | Sort objects by key (`"asc"` or `"desc"`) |
| `unique(arr)` | Unique values, preserving insertion order |
| `counts(arr)` | Frequency count as an object |
| `normalize(arr, newMin?, newMax?)` | Scale values to a range (default 0–1) |
| `filterRows(rows, predicate)` | Filter an array of objects |

### Parsing Helpers

| Function | Description |
|----------|-------------|
| `autoType(rows)` | Auto-convert strings to numbers, dates, or null |
| `parseDates(rows, key, format?)` | Parse a date column (ISO 8601 or custom format) |

### Color / Scales

| Function | Description |
|----------|-------------|
| `linearScale(domain, range)` | Create a linear mapping function |
| `colorScale(domain, colors)` | Create a color interpolation function |
| `bin(arr, numBins)` | Equal-width histogram binning |

### Formatting

| Function | Description |
|----------|-------------|
| `formatNumber(n, decimals?)` | Locale-aware number formatting |
| `formatPercent(n, decimals?)` | Format a decimal as a percentage string |

## Examples

Run the Node examples directly:

```bash
node examples/basics.js
node examples/scales-and-color.js
```

For the browser demo, start a local server (ES modules require HTTP):

```bash
npx serve .
# then open http://localhost:3000/examples/demo.html
```

## Running Tests

```bash
npm test
```

54 tests, zero dependencies — uses Node's built-in test runner.

## License

[MIT](LICENSE)
