import React, { useEffect, useMemo, useState } from 'react';
import PolarChart from './PolarChart.jsx';
import {
  parseGliderCsv,
  groupGliders,
  fitQuadratic,
  bestGlide,
  speedToFly,
  blockSpeeds,
} from './polarData.js';

const DATA_URL = '/glider/data/gliders.csv';

const DEFAULT_POINTS = [
  { speed: '59.4', sink: '1.46' },
  { speed: '81', sink: '2.51' },
  { speed: '97.2', sink: '4.04' },
];

const CUSTOM = '__custom__';

export default function GliderCalculator() {
  const [gliders, setGliders] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(CUSTOM);

  const [manual, setManual] = useState(DEFAULT_POINTS);
  const [headwind, setHeadwind] = useState(0);
  const [climb, setClimb] = useState(2);
  const [airmass, setAirmass] = useState(0);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseGliderCsv(text);
        setGliders(parsed);
        setLoadState(parsed.length ? 'ready' : 'empty');
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(`${DATA_URL} — ${err.message}`);
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => groupGliders(gliders), [gliders]);
  const selected = useMemo(
    () => gliders.find((g) => g.id === selectedId) || null,
    [gliders, selectedId]
  );

  // The active polar: either the selected glider or a fit through the
  // three manually entered points.
  const active = useMemo(() => {
    if (selected) {
      return {
        coeffs: selected.coeffs,
        points: selected.points,
        label: selected.name,
        caption: `${selected.source} · ${selected.wingLoading} kg/m² · ${selected.points.length} measured points`,
      };
    }
    const pts = manual
      .map((p) => ({ speed: parseFloat(p.speed), sink: parseFloat(p.sink) }))
      .filter((p) => isFinite(p.speed) && isFinite(p.sink) && p.speed > 0 && p.sink > 0);

    if (pts.length < 3) return null;
    const coeffs = fitQuadratic(pts);
    if (!coeffs) return null;
    return { coeffs, points: pts, label: 'Custom polar', caption: 'Fitted through your three points' };
  }, [selected, manual]);

  const results = useMemo(() => {
    if (!active) return null;
    const bg = bestGlide(active.coeffs);
    const stf = speedToFly(active.coeffs, { headwind, climb, airmass: advanced ? airmass : 0 });
    const blocks = blockSpeeds(active.coeffs, { headwind, airmass: advanced ? airmass : 0 });
    if (!bg || !stf) return null;
    return { bg, stf, blocks };
  }, [active, headwind, climb, airmass, advanced]);

  const updateManual = (i, field, value) => {
    setManual((prev) => prev.map((p, j) => (j === i ? { ...p, [field]: value } : p)));
    setSelectedId(CUSTOM);
  };

  const vRange = useMemo(() => {
    if (!active) return [40, 110];
    const speeds = active.points.map((p) => p.speed);
    return [Math.min(...speeds), Math.max(...speeds)];
  }, [active]);

  return (
    <div className="gsf">
      <header className="gsf-head">
        <h1>Speed to fly</h1>
        <p>
          Pick a glider or enter your own polar points, set the conditions, and read the speed
          to fly. All speeds and sink rates are in knots.
        </p>
      </header>

      {/* 1. Polar source ---------------------------------------------------- */}
      <section className="panel">
        <h2>Polar curve</h2>

        <label className="field">
          <span className="field-label">Glider</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loadState !== 'ready'}
          >
            <option value={CUSTOM}>Custom — enter points below</option>
            {groups.map((grp) => (
              <optgroup key={grp.baseName} label={grp.baseName}>
                {grp.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.wingLoading} kg/m² — {v.source}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {loadState === 'loading' && <p className="note">Loading glider data…</p>}
        {loadState === 'error' && (
          <p className="note note-warn">
            Could not load the glider list. Enter points manually below.
            <br />
            <span className="mono">{loadError}</span>
          </p>
        )}
        {loadState === 'ready' && selected && (
          <p className="note">
            {active.caption}
            {selected.coeffs.rms > 0.25 && ' · loose fit, check the curve against the dots'}
          </p>
        )}

        {!selected && (
          <>
            <p className="note">
              Three points from the manufacturer's polar. Speed in knots, sink as a positive
              number.
            </p>
            <div className="points">
              {manual.map((p, i) => (
                <div className="point-row" key={i}>
                  <span className="point-n">{i + 1}</span>
                  <label>
                    <span className="field-label">Speed</span>
                    <input
                      type="number"
                      step="0.1"
                      value={p.speed}
                      onChange={(e) => updateManual(i, 'speed', e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="field-label">Sink</span>
                    <input
                      type="number"
                      step="0.01"
                      value={p.sink}
                      onChange={(e) => updateManual(i, 'sink', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Conditions ------------------------------------------------------ */}
      <section className="panel">
        <h2>Conditions</h2>

        <div className="slider">
          <div className="slider-head">
            <span>Wind component</span>
            <strong>
              {headwind === 0
                ? 'Still air'
                : `${Math.abs(headwind)} kt ${headwind > 0 ? 'headwind' : 'tailwind'}`}
            </strong>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            step="1"
            value={headwind}
            onChange={(e) => setHeadwind(Number(e.target.value))}
          />
          <div className="slider-ends">
            <span>40 kt tail</span>
            <span>40 kt head</span>
          </div>
        </div>

        <div className="slider">
          <div className="slider-head">
            <span>Expected climb rate</span>
            <strong>{climb.toFixed(1)} kt</strong>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={climb}
            onChange={(e) => setClimb(Number(e.target.value))}
          />
          <div className="slider-ends">
            <span>No thermals</span>
            <span>8 kt average</span>
          </div>
        </div>

        <label className="check">
          <input
            type="checkbox"
            checked={advanced}
            onChange={(e) => setAdvanced(e.target.checked)}
          />
          <span>Advanced options</span>
        </label>

        {advanced && (
          <div className="slider">
            <div className="slider-head">
              <span>Air mass</span>
              <strong>
                {airmass === 0
                  ? 'Neutral'
                  : `${Math.abs(airmass).toFixed(1)} kt ${airmass > 0 ? 'sink' : 'lift'}`}
              </strong>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={airmass}
              onChange={(e) => setAirmass(Number(e.target.value))}
            />
            <div className="slider-ends">
              <span>5 kt lift</span>
              <span>5 kt sink</span>
            </div>
          </div>
        )}
      </section>

      {!active && (
        <section className="panel">
          <p className="note note-warn">
            Enter three points with increasing sink to fit a polar curve.
          </p>
        </section>
      )}

      {/* 3. Quick reference ------------------------------------------------- */}
      {results && (
        <section className="panel quickref">
          <h2>Quick reference</h2>
          <dl>
            <div>
              <dt>Best L/D (still air) at</dt>
              <dd>{results.bg.speed.toFixed(0)} kt</dd>
            </div>
            <div>
              <dt>Glide ratio</dt>
              <dd>{results.bg.ld.toFixed(1)} : 1</dd>
            </div>
            <div className="highlight">
              <dt>Fly at</dt>
              <dd>{results.stf.speed.toFixed(0)} kt</dd>
            </div>
            <div>
              <dt>Speed delta</dt>
              <dd>
                {results.stf.speed - results.bg.speed >= 0 ? '+' : ''}
                {(results.stf.speed - results.bg.speed).toFixed(0)} kt
              </dd>
            </div>
          </dl>
        </section>
      )}

      {/* 4. Polar graph ----------------------------------------------------- */}
      {active && results && (
        <section className="panel">
          <h2>{active.label}</h2>
          <PolarChart
            coeffs={active.coeffs}
            points={active.points}
            vMin={vRange[0]}
            vMax={vRange[1]}
            bestGlideSpeed={results.bg.speed}
            stfSpeed={results.stf.speed}
            headwind={headwind}
            climb={climb}
            airmass={advanced ? airmass : 0}
            showAirmass={advanced}
          />
          <ul className="legend">
            <li>
              <i className="sw sw-curve" /> Fitted polar
            </li>
            <li>
              <i className="sw sw-best" /> Tangent from origin — best glide
            </li>
            <li>
              <i className="sw sw-stf" /> Tangent from shifted origin — speed to fly
            </li>
          </ul>
        </section>
      )}

      {/* 5. Speed to fly + block speeds ------------------------------------- */}
      {results && (
        <section className="panel">
          <h2>Speed to fly</h2>
          <div className="stats">
            <div>
              <span className="stat-label">Airspeed</span>
              <span className="stat-value">{results.stf.speed.toFixed(0)}</span>
              <span className="stat-unit">kt</span>
            </div>
            <div>
              <span className="stat-label">Groundspeed</span>
              <span className="stat-value">{results.stf.groundspeed.toFixed(0)}</span>
              <span className="stat-unit">kt</span>
            </div>
            <div>
              <span className="stat-label">Sink at cruise</span>
              <span className="stat-value">{results.stf.netSink.toFixed(1)}</span>
              <span className="stat-unit">kt</span>
            </div>
            <div>
              <span className="stat-label">Glide ratio</span>
              <span className="stat-value">{results.stf.glideRatio.toFixed(1)}</span>
              <span className="stat-unit">: 1</span>
            </div>
          </div>

          <h3>Block speeds</h3>
          <p className="note">
            Speeds to fly at the standard climb settings
            {headwind !== 0 &&
              `, with ${Math.abs(headwind)} kt ${headwind > 0 ? 'headwind' : 'tailwind'}`}
            .
          </p>
          <table className="blocks">
            <thead>
              <tr>
                <th>Expected climb</th>
                <th>Fly at</th>
                <th>Sink at cruise</th>
                <th>Cross-country speed</th>
              </tr>
            </thead>
            <tbody>
              {results.blocks.map((b) => (
                <tr key={b.climb} className={Math.abs(b.climb - climb) < 0.05 ? 'current' : ''}>
                  <td>{b.climb} kt</td>
                  <td className="num">{b.speed ? `${b.speed.toFixed(0)} kt` : '—'}</td>
                  <td className="num">{b.netSink ? `${b.netSink.toFixed(1)} kt` : '—'}</td>
                  <td className="num">{b.xcSpeed ? `${b.xcSpeed.toFixed(0)} kt` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            Sink at cruise rises with the climb setting because you are flying faster. Cross-country
            speed accounts for the time spent climbing back up.
          </p>
        </section>
      )}

      <footer className="gsf-foot">
        <p>
          A quadratic is fitted through every available data point by least squares, so the curve
          is an approximation of the real polar. Treat the numbers as planning figures, not as a
          substitute for your flight manual.
        </p>
      </footer>
    </div>
  );
}
