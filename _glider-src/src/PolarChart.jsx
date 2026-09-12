import React from 'react';
import { sinkAt } from './polarData.js';

/**
 * Polar curve drawn the way the gliding textbooks do it:
 * horizontal speed axis along the top, sink increasing downwards,
 * axes extended past the origin, and tangent construction shown.
 */
export default function PolarChart({
  coeffs,
  points,
  vMin,
  vMax,
  bestGlideSpeed,
  stfSpeed,
  headwind,
  climb,
  airmass,
  showAirmass,
}) {
  const W = 720;
  const H = 460;
  const M = { top: 46, right: 24, bottom: 28, left: 58 };

  const originY = climb + airmass; // how far the shifted origin sits above zero
  const yTop = Math.max(1, Math.ceil(originY + 0.001));

  const sinkFloor = Math.max(
    2,
    Math.ceil(sinkAt(coeffs, vMax) + 0.4)
  );

  // Leave room to the left of zero so the tailwind origin stays on canvas.
  const xLo = Math.min(-12, headwind - 8);
  const xHi = Math.max(vMax + 8, headwind + 8);

  const px = (v) => M.left + ((v - xLo) / (xHi - xLo)) * (W - M.left - M.right);
  const py = (y) => M.top + ((yTop - y) / (yTop + sinkFloor)) * (H - M.top - M.bottom);

  // Curve is only drawn across the span of real data. Extrapolating a
  // quadratic well beyond the measured points is not trustworthy.
  const curve = [];
  const STEPS = 140;
  for (let i = 0; i <= STEPS; i++) {
    const v = vMin + ((vMax - vMin) * i) / STEPS;
    curve.push(`${i === 0 ? 'M' : 'L'}${px(v).toFixed(2)},${py(-sinkAt(coeffs, v)).toFixed(2)}`);
  }

  const xTicks = [];
  for (let v = 0; v <= xHi; v += 20) xTicks.push(v);

  const yTicks = [];
  for (let y = yTop; y >= -sinkFloor; y -= 1) yTicks.push(y);

  // Extend a tangent line past its touch point so the construction reads clearly.
  const tangent = (x0, y0, vT) => {
    if (vT == null) return null;
    const yT = -sinkAt(coeffs, vT);
    const dx = vT - x0;
    const dy = yT - y0;
    const k = 1.35; // overshoot factor
    return {
      x1: px(x0),
      y1: py(y0),
      x2: px(x0 + dx * k),
      y2: py(y0 + dy * k),
      tx: px(vT),
      ty: py(yT),
    };
  };

  const tBest = tangent(0, 0, bestGlideSpeed);
  const tStf = tangent(headwind, originY, stfSpeed);
  const shifted = Math.abs(headwind) > 0.01 || Math.abs(originY) > 0.01;

  return (
    <svg
      className="polar-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Polar curve with speed-to-fly tangent construction"
    >
      {/* grid */}
      <g className="grid">
        {xTicks.map((v) => (
          <line key={`gx${v}`} x1={px(v)} y1={py(yTop)} x2={px(v)} y2={py(-sinkFloor)} />
        ))}
        {yTicks.map((y) => (
          <line key={`gy${y}`} x1={px(xLo)} y1={py(y)} x2={px(xHi)} y2={py(y)} />
        ))}
      </g>

      {/* still-air axes, extended past the origin in both directions */}
      <g className="axis">
        <line x1={px(xLo)} y1={py(0)} x2={px(xHi)} y2={py(0)} markerEnd="url(#arrowInk)" />
        <line x1={px(0)} y1={py(yTop)} x2={px(0)} y2={py(-sinkFloor)} />
      </g>

      <text className="axis-title" x={px(xHi)} y={py(0) - 14} textAnchor="end">
        Airspeed (kt)
      </text>
      <text
        className="axis-title"
        x={16}
        y={M.top + (H - M.top - M.bottom) / 2}
        textAnchor="middle"
        transform={`rotate(-90 16 ${M.top + (H - M.top - M.bottom) / 2})`}
      >
        Sink (kt)
      </text>

      {xTicks.map((v) =>
        v === 0 ? null : (
          <text key={`tx${v}`} className="tick" x={px(v)} y={py(0) - 7} textAnchor="middle">
            {v}
          </text>
        )
      )}
      {yTicks.map((y) => (
        <text key={`ty${y}`} className="tick" x={px(xLo) - 6} y={py(y) + 4} textAnchor="end">
          {y === 0 ? '0' : y.toFixed(0)}
        </text>
      ))}

      {/* shifted coordinate system for the current conditions */}
      {shifted && (
        <g className="shifted">
          <line x1={px(headwind)} y1={py(yTop)} x2={px(headwind)} y2={py(-sinkFloor)} />
          <line x1={px(xLo)} y1={py(originY)} x2={px(xHi)} y2={py(originY)} />
          {Math.abs(originY) > 0.01 && (
            <line
              className="climb-arrow"
              x1={px(headwind)}
              y1={py(0)}
              x2={px(headwind)}
              y2={py(originY)}
              markerEnd="url(#arrowStf)"
            />
          )}
        </g>
      )}

      {/* tangent from the true origin: best glide in still air */}
      {tBest && (
        <>
          <line className="tangent-best" x1={tBest.x1} y1={tBest.y1} x2={tBest.x2} y2={tBest.y2} />
          <circle className="dot-best" cx={tBest.tx} cy={tBest.ty} r={4.5} />
        </>
      )}

      {/* tangent from the shifted origin: speed to fly.
          In still air it lies exactly on top of the best-glide tangent, so
          there is nothing to gain by drawing it twice. */}
      {tStf && shifted && (
        <>
          <line className="tangent-stf" x1={tStf.x1} y1={tStf.y1} x2={tStf.x2} y2={tStf.y2} />
          <circle className="dot-stf" cx={tStf.tx} cy={tStf.ty} r={4.5} />
          <circle className="dot-origin" cx={px(headwind)} cy={py(originY)} r={3.5} />
        </>
      )}

      {/* measured data points */}
      <g className="data-dots">
        {points.map((p, i) => (
          <circle key={i} cx={px(p.speed)} cy={py(-p.sink)} r={2.4} />
        ))}
      </g>

      <path className="curve" d={curve.join(' ')} />

      {/* labels */}
      {tBest && (
        <text className="label-best" x={tBest.tx} y={tBest.ty + 20} textAnchor="middle">
          {bestGlideSpeed.toFixed(0)} kt
        </text>
      )}
      {tStf && shifted && Math.abs(stfSpeed - bestGlideSpeed) > 1.5 && (
        <text
          className="label-stf"
          x={tStf.tx}
          y={tStf.ty + (Math.abs(stfSpeed - bestGlideSpeed) < 10 ? 36 : 20)}
          textAnchor="middle"
        >
          {stfSpeed.toFixed(0)} kt
        </text>
      )}
      {shifted && Math.abs(originY) > 0.05 && (
        <text className="label-stf" x={px(headwind) + 8} y={py(originY) - 6}>
          {showAirmass && Math.abs(airmass) > 0.01
            ? `climb ${climb.toFixed(1)} + air ${airmass.toFixed(1)}`
            : `climb ${climb.toFixed(1)} kt`}
        </text>
      )}
      {shifted && Math.abs(headwind) > 0.5 && (
        <text className="label-wind" x={px(headwind)} y={py(-sinkFloor) + 18} textAnchor="middle">
          {headwind > 0 ? `${headwind.toFixed(0)} kt head` : `${Math.abs(headwind).toFixed(0)} kt tail`}
        </text>
      )}

      <defs>
        <marker id="arrowInk" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 z" className="arrowhead-ink" />
        </marker>
        <marker id="arrowStf" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 z" className="arrowhead-stf" />
        </marker>
      </defs>
    </svg>
  );
}
