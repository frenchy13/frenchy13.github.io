// Polar data loading, fitting and speed-to-fly mathematics.
// All internal units are knots. Sink is stored as a POSITIVE magnitude
// (1.5 means sinking at 1.5 kt) and only negated for plotting.

const KMH_TO_KT = 1 / 1.852;
const MS_TO_KT = 1.9438445;

export const SOURCE_NAMES = {
  IDA: 'Idaflieg',
  DJ: 'Dick Johnson',
  MD: 'Martin Dennis',
  'MD+': 'Martin Dennis',
  AG: 'Andrew Gough',
  GB: 'George Bagnall',
  real: 'Idaflieg',
};

export function expandSource(code) {
  const key = (code || '').trim();
  return SOURCE_NAMES[key] || key || 'Unknown';
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

// Minimal RFC4180-ish splitter. Handles quoted fields containing commas.
function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function isBlank(cell) {
  const t = (cell || '').trim();
  return t === '' || t === '-' || t === '—' || t.toLowerCase() === 'n/a';
}

/**
 * Parse the wide, sparse polar CSV.
 *
 * Expected shape:
 *   A/C, Source, G/F, units, <airspeed in km/h>, <airspeed>, ...
 * with sink values in the airspeed columns, blank where no data exists.
 *
 * Returns an array of glider records with points already converted to knots.
 */
export function parseGliderCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r\n|\n|\r/)
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]);
  const speedCols = header.slice(4).map((h) => parseFloat(h));

  const gliders = [];

  for (let r = 1; r < lines.length; r++) {
    const row = splitCsvLine(lines[r]);
    const name = (row[0] || '').trim();
    if (!name) continue;

    const unitRaw = (row[3] || '').trim().toLowerCase();
    // m/s, m/sec, mps -> metres per second. Anything else assumed knots.
    const sinkToKt = unitRaw.startsWith('m') ? MS_TO_KT : 1;

    const points = [];
    for (let i = 0; i < speedCols.length; i++) {
      const cell = row[4 + i];
      if (isBlank(cell)) continue;

      const sinkRaw = parseFloat(cell);
      const speedKmh = speedCols[i];
      if (!isFinite(sinkRaw) || !isFinite(speedKmh)) continue;
      if (speedKmh <= 0) continue; // guard against a zero-speed column
      // A glider never sinks at exactly zero. Some rows use 0.00 as padding
      // in the trailing columns; treating it as data inverts the parabola.
      if (Math.abs(sinkRaw) < 1e-9) continue;

      points.push({
        speed: speedKmh * KMH_TO_KT,
        sink: Math.abs(sinkRaw) * sinkToKt,
      });
    }

    // A quadratic needs at least three points.
    if (points.length < 3) continue;

    points.sort((p, q) => p.speed - q.speed);

    const coeffs = fitQuadratic(points);
    if (!coeffs) continue;

    gliders.push({
      id: `${name}__${r}`,
      name,
      baseName: name.replace(/\s*\(.*\)\s*$/, '').trim(),
      sourceCode: (row[1] || '').trim(),
      source: expandSource(row[1]),
      wingLoading: parseFloat(row[2]),
      units: (row[3] || '').trim(),
      points,
      coeffs,
    });
  }

  // Group name first, then wing loading ascending.
  gliders.sort(
    (a, b) =>
      a.baseName.localeCompare(b.baseName, undefined, { numeric: true }) ||
      (a.wingLoading || 0) - (b.wingLoading || 0)
  );

  return gliders;
}

export function groupGliders(gliders) {
  const map = new Map();
  for (const g of gliders) {
    if (!map.has(g.baseName)) map.set(g.baseName, []);
    map.get(g.baseName).push(g);
  }
  return [...map.entries()].map(([baseName, variants]) => ({ baseName, variants }));
}

// ---------------------------------------------------------------------------
// Curve fitting
// ---------------------------------------------------------------------------

/**
 * Least-squares fit of sink = a*v^2 + b*v + c through any number of points
 * (minimum three). With exactly three points this reduces to the exact
 * interpolating parabola, so manual entry behaves identically.
 *
 * Solves the 3x3 normal equations by Gaussian elimination with partial
 * pivoting. Speeds are centred first to keep the matrix well conditioned.
 */
export function fitQuadratic(points) {
  const n = points.length;
  if (n < 3) return null;

  const vBar = points.reduce((s, p) => s + p.speed, 0) / n;

  // Moments of the centred abscissa.
  let S0 = 0, S1 = 0, S2 = 0, S3 = 0, S4 = 0;
  let T0 = 0, T1 = 0, T2 = 0;
  for (const p of points) {
    const x = p.speed - vBar;
    const x2 = x * x;
    const w = p.sink;
    S0 += 1;
    S1 += x;
    S2 += x2;
    S3 += x2 * x;
    S4 += x2 * x2;
    T0 += w;
    T1 += w * x;
    T2 += w * x2;
  }

  const M = [
    [S4, S3, S2, T2],
    [S3, S2, S1, T1],
    [S2, S1, S0, T0],
  ];

  const sol = solve3(M);
  if (!sol) return null;

  // Coefficients in the centred variable u = v - vBar.
  const [A, B, C] = sol;

  // Expand back to v: A(v-vBar)^2 + B(v-vBar) + C
  const a = A;
  const b = B - 2 * A * vBar;
  const c = C - B * vBar + A * vBar * vBar;

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) return null;
  // A sensible polar opens upward and has a positive minimum-sink value.
  if (a <= 0) return null;

  // Root-mean-square residual, in knots, so fit quality can be shown.
  let ss = 0;
  for (const p of points) {
    const pred = a * p.speed * p.speed + b * p.speed + c;
    ss += (pred - p.sink) ** 2;
  }
  const rms = Math.sqrt(ss / n);

  return { a, b, c, rms, n };
}

function solve3(M) {
  const m = M.map((row) => row.slice());
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[piv][col])) piv = r;
    }
    if (Math.abs(m[piv][col]) < 1e-12) return null;
    [m[col], m[piv]] = [m[piv], m[col]];

    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let k = col; k < 4; k++) m[r][k] -= f * m[col][k];
    }
  }
  return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
}

// ---------------------------------------------------------------------------
// Speed-to-fly mathematics
// ---------------------------------------------------------------------------

/** Sink rate (positive, knots) at airspeed v. */
export function sinkAt(coeffs, v) {
  const { a, b, c } = coeffs;
  return a * v * v + b * v + c;
}

/** Airspeed of minimum sink: vertex of the parabola. */
export function minSinkSpeed(coeffs) {
  return -coeffs.b / (2 * coeffs.a);
}

/**
 * Tangent from the point (x0, y0) in plot coordinates, where the curve is
 * drawn as y = -sink(v). Returns the airspeed at which the line touches.
 *
 * Derivation gives  v = x0 + sqrt(x0^2 + (b*x0 + c + y0)/a).
 *
 *   x0 = headwind component (positive headwind shifts the origin right)
 *   y0 = MacCready climb + airmass sink (both shift the origin up)
 */
export function tangentSpeed(coeffs, x0 = 0, y0 = 0) {
  const { a, b, c } = coeffs;
  const disc = x0 * x0 + (b * x0 + c + y0) / a;
  if (disc < 0) return null;
  return x0 + Math.sqrt(disc);
}

/** Best glide in still air, plus the resulting L/D. */
export function bestGlide(coeffs) {
  const v = tangentSpeed(coeffs, 0, 0);
  if (v === null || v <= 0) return null;
  const w = sinkAt(coeffs, v);
  return { speed: v, sink: w, ld: v / w };
}

/**
 * Full speed-to-fly solution for a set of conditions.
 *
 *   headwind    knots, positive into wind
 *   climb       expected MacCready climb rate, knots
 *   airmass     vertical air movement, knots, positive = sinking air
 */
export function speedToFly(coeffs, { headwind = 0, climb = 0, airmass = 0 } = {}) {
  const v = tangentSpeed(coeffs, headwind, climb + airmass);
  if (v === null || v <= 0) return null;

  const polarSink = sinkAt(coeffs, v);
  const netSink = polarSink + airmass; // rate of height loss while cruising
  const groundspeed = v - headwind;
  const glideRatio = netSink > 0 ? groundspeed / netSink : Infinity;

  // Achieved cross-country speed: cruise, then climb back to height.
  let xcSpeed = null;
  if (climb > 0 && netSink > 0 && groundspeed > 0) {
    xcSpeed = (groundspeed * climb) / (climb + netSink);
  }

  return { speed: v, polarSink, netSink, groundspeed, glideRatio, xcSpeed };
}

/** Speeds to fly at the standard 2 / 4 / 6 kt block settings. */
export function blockSpeeds(coeffs, { headwind = 0, airmass = 0 } = {}, settings = [2, 4, 6]) {
  return settings.map((climb) => {
    const s = speedToFly(coeffs, { headwind, climb, airmass });
    return { climb, ...(s || {}) };
  });
}
