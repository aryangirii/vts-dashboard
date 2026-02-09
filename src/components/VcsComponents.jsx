import React, { useState, useEffect, useRef } from "react";
import "./VcsComponents.css";

/* ========================================================
   LOADING SKELETON
======================================================== */
export function LoadingSkeleton({ count = 1, height = "40px" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="loading-skeleton"
          style={{ height, marginBottom: 8 }}
        />
      ))}
    </>
  );
}

/* ========================================================
   SUMMARY CARDS
======================================================== */

function useAnimatedNumber(value, duration = 400) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousRef = useRef(value);

  useEffect(() => {
    const from = previousRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    let frameId;

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2); // easeOutQuad
      const current = from + (to - from) * eased;
      setDisplayValue(current);

      if (t < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        previousRef.current = to;
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return displayValue;
}

export function SummaryCards({ data, loading }) {
  if (loading) {
    return (
      <div className="summary-cards">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} height="90px" />
        ))}
      </div>
    );
  }

  const animatedTotal = useAnimatedNumber(data.totalVehicles);
  const animatedAvgConfidence = useAnimatedNumber(data.avgConfidence);

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="label">Total Vehicles</div>
        <div className="value">{Math.round(animatedTotal).toLocaleString()}</div>
      </div>
      <div className="summary-card">
        <div className="label">Dominant Type</div>
        <div className="value">{data.dominantType}</div>
      </div>
      <div className="summary-card">
        <div className="label">Peak Traffic</div>
        <div className="value">{data.peakTrafficTime}</div>
      </div>
      <div className="summary-card">
        <div className="label">Avg Confidence</div>
        <div className="value">
          {animatedAvgConfidence.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   FILTER PANEL
======================================================== */
export function FilterPanel({
  selectedCamera,
  onCameraChange,
  dateFrom,
  dateTo,
  onDateChange,
  timeGrouping,
  onTimeGroupingChange,
  cameras,
  onPresetClick,
}) {
  return (
    <div className="filter-panel">
      <select value={selectedCamera} onChange={(e) => onCameraChange(e.target.value)}>
        {cameras.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input type="date" value={dateFrom} onChange={(e) => onDateChange("from", e.target.value)} />
      <input type="date" value={dateTo} onChange={(e) => onDateChange("to", e.target.value)} />

      <select value={timeGrouping} onChange={(e) => onTimeGroupingChange(e.target.value)}>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
      </select>

      <div className="preset-buttons">
        <button onClick={() => onPresetClick("today")}>Today</button>
        <button onClick={() => onPresetClick("7days")}>7 Days</button>
        <button onClick={() => onPresetClick("30days")}>30 Days</button>
      </div>
    </div>
  );
}

/* ========================================================
   VEHICLE TREND CHART – SOC STYLE (REFINED)
======================================================== */
export function VehicleTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const WIDTH = 820;
  const HEIGHT = 240;

  const PADDING = {
    top: 24,
    right: 20,
    bottom: 40,
    left: 64,
  };

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  // Inner padding so lines never touch the axes
  const innerPaddingX = plotWidth * 0.04;
  const innerPaddingY = plotHeight * 0.06;

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.Car, d.Auto, d.Bike, d.Bus, d.Truck])
  );

  // Clamp to a clean 0–800 style scale, but still handle higher data safely
  const baseMax = Math.max(maxValue, 800);
  const niceMax = Math.ceil(baseMax / 200) * 200; // 0,200,400,600,800...
  const yStep = 200;

  const yTicks = [];
  for (let v = 0; v <= niceMax; v += yStep) {
    yTicks.push(v);
  }

  const xScale = (index) =>
    PADDING.left +
    innerPaddingX +
    (index / Math.max(1, data.length - 1)) *
      (plotWidth - innerPaddingX * 2);

  const yScale = (value) =>
    PADDING.top +
    innerPaddingY +
    (1 - value / niceMax) * (plotHeight - innerPaddingY * 2);

  const VEHICLES = [
    { key: "Car", color: "#3b82f6", stroke: 2.4 },
    { key: "Auto", color: "#f59e0b", stroke: 1.8 },
    { key: "Bike", color: "#8b5cf6", stroke: 1.8 },
    { key: "Bus", color: "#10b981", stroke: 1.6 },
    { key: "Truck", color: "#ef4444", stroke: 1.6 },
  ];

  const buildPath = (points) =>
    points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${path} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
    }, "");

  const xTickCount = Math.min(6, data.length);
  const xTickStep = Math.max(1, Math.floor(data.length / (xTickCount - 1)));
  const allTicks = data.map((d, index) => ({ label: d.time, index }));

  // Prefer specific SOC-style time labels when present
  const preferredTimes = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:00"];
  const preferredTicks = preferredTimes
    .map((label) => allTicks.find((t) => t.label === label))
    .filter(Boolean);

  const xTicks =
    preferredTicks.length >= 4
      ? preferredTicks
      : allTicks.filter(
          (t) =>
            t.index % xTickStep === 0 || t.index === data.length - 1
        );

  const [hover, setHover] = useState(null);

  const handleMouseMove = (event) => {
    const { offsetX } = event.nativeEvent;
    const clampedX = Math.max(
      PADDING.left + innerPaddingX,
      Math.min(
        PADDING.left + plotWidth - innerPaddingX,
        offsetX
      )
    );

    const ratio =
      (clampedX - (PADDING.left + innerPaddingX)) /
      (plotWidth - innerPaddingX * 2);

    const index = Math.max(
      0,
      Math.min(data.length - 1, Math.round(ratio * (data.length - 1)))
    );

    const pointX = xScale(index);
    const pointData = data[index];

    setHover({
      index,
      x: pointX,
      data: pointData,
    });
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div className="chart-container">
      <h3>Vehicle Traffic Trend</h3>

      <div className="trend-chart-wrapper">
        <svg
          width="100%"
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="trend-chart"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Plot background */}
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={plotWidth}
            height={plotHeight}
            className="chart-plot-area"
          />

          {/* Horizontal grid + Y ticks (aligned with axis) */}
          {yTicks.map((value) => {
            const y = yScale(value);
            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={PADDING.left + plotWidth}
                  y1={y}
                  y2={y}
                  className="chart-grid-line"
                />
                <text
                  x={PADDING.left - 8}
                  y={y - 2}
                  className="chart-tick-label chart-tick-label-y"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Vertical grid + X ticks (aligned with axis) */}
          {xTicks.map((tick) => {
            const x = xScale(tick.index);
            return (
              <g key={tick.index}>
                <line
                  x1={x}
                  x2={x}
                  y1={PADDING.top}
                  y2={PADDING.top + plotHeight}
                  className="chart-grid-line chart-grid-line-vertical"
                />
                <text
                  x={x}
                  y={PADDING.top + plotHeight + 16}
                  className="chart-tick-label chart-tick-label-x"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={PADDING.left}
            x2={PADDING.left}
            y1={PADDING.top}
            y2={PADDING.top + plotHeight}
            className="chart-axis-line"
          />
          <line
            x1={PADDING.left}
            x2={PADDING.left + plotWidth}
            y1={PADDING.top + plotHeight}
            y2={PADDING.top + plotHeight}
            className="chart-axis-line"
          />

          {/* Lines */}
          {VEHICLES.map((vehicle) => {
            const points = data.map((d, index) => ({
              x: xScale(index),
              y: yScale(d[vehicle.key]),
            }));

            return (
              <path
                key={vehicle.key}
                d={buildPath(points)}
                fill="none"
                stroke={vehicle.color}
                strokeWidth={vehicle.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="trend-path"
              />
            );
          })}

          {/* Hover crosshair */}
          {hover && (
            <line
              x1={hover.x}
              x2={hover.x}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              className="chart-hover-line"
            />
          )}
        </svg>

        {/* Hover tooltip */}
        {hover && (
          <div
            className="trend-tooltip"
            style={{ left: `${(hover.x / WIDTH) * 100}%` }}
          >
            <div className="tooltip-header">{hover.data.time}</div>
            {VEHICLES.map((v) => (
              <div key={v.key} className="tooltip-row">
                <span
                  className="tooltip-color"
                  style={{ background: v.color }}
                />
                <span>{v.key}</span>
                <span>{hover.data[v.key].toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   VEHICLE CATEGORY BAR CHART – SOC STYLE
======================================================== */
export function VehicleCategoryChart({ data }) {
  if (!data?.length) return null;

  const totals = { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 };
  data.forEach((d) =>
    Object.keys(totals).forEach((k) => {
      totals[k] += d[k];
    })
  );

  const categories = Object.keys(totals);
  const maxValue = Math.max(...Object.values(totals));

  const niceMax =
    maxValue <= 1000
      ? Math.ceil(maxValue / 100) * 100
      : Math.ceil(maxValue / 200) * 200;

  // Keep at most ~5 ticks for readability
  const roughStep = niceMax / 5;
  const candidates = [50, 100, 200, 500, 1000];
  const yStep =
    candidates.find((c) => c >= roughStep) || 1000;

  const yTicks = [];
  for (let v = 0; v <= niceMax; v += yStep) {
    yTicks.push(v);
  }

  const WIDTH = 420;
  const HEIGHT = 260;

  const PADDING = {
    top: 24,
    right: 16,
    bottom: 44,
    left: 60,
  };

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const xScale = (index) =>
    PADDING.left +
    ((index + 0.5) / categories.length) * plotWidth;

  const yScale = (value) =>
    PADDING.top +
    (1 - value / niceMax) * plotHeight;

  const BAR_COLORS = {
    Car: "#3b82f6",
    Auto: "#f59e0b",
    Bike: "#8b5cf6",
    Bus: "#10b981",
    Truck: "#ef4444",
  };

  const barWidth = (plotWidth / categories.length) * 0.4;

  const [barHover, setBarHover] = useState(null);

  return (
    <div className="chart-container">
      <h3>Vehicle Categories</h3>
      <div className="bar-chart">
        <svg
          width="100%"
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="bar-chart-svg"
        >
          <defs>
            {categories.map((name) => (
              <linearGradient
                key={name}
                id={`bar-${name}-gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={BAR_COLORS[name]} stopOpacity="0.95" />
                <stop offset="100%" stopColor={BAR_COLORS[name]} stopOpacity="0.7" />
              </linearGradient>
            ))}
          </defs>
          {/* Plot background */}
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={plotWidth}
            height={plotHeight}
            className="chart-plot-area"
          />

          {/* Horizontal grid + Y ticks */}
          {yTicks.map((value) => {
            const y = yScale(value);
            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={PADDING.left + plotWidth}
                  y1={y}
                  y2={y}
                  className="chart-grid-line"
                />
                <text
                  x={PADDING.left - 8}
                  y={y - 2}
                  className="chart-tick-label chart-tick-label-y"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={PADDING.left}
            x2={PADDING.left}
            y1={PADDING.top}
            y2={PADDING.top + plotHeight}
            className="chart-axis-line"
          />
          <line
            x1={PADDING.left}
            x2={PADDING.left + plotWidth}
            y1={PADDING.top + plotHeight}
            y2={PADDING.top + plotHeight}
            className="chart-axis-line"
          />

          {/* Bars + X labels */}
          {categories.map((name, index) => {
            const value = totals[name];
            const xCenter = xScale(index);
            const y = yScale(value);
            const barHeight = PADDING.top + plotHeight - y;

            return (
              <g key={name}>
                <rect
                  x={xCenter - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#bar-${name}-gradient)`}
                  className="bar-rect"
                  rx={3}
                  onMouseMove={() =>
                    setBarHover({
                      name,
                      value,
                      x: xCenter,
                    })
                  }
                  onMouseLeave={() => setBarHover(null)}
                />
                {barHover && barHover.name === name && (
                  <text
                    x={xCenter}
                    y={y - 6}
                    className="chart-tick-label chart-tick-label-x"
                  >
                    {value.toLocaleString()}
                  </text>
                )}
                <text
                  x={xCenter}
                  y={PADDING.top + plotHeight + 16}
                  className="chart-tick-label chart-tick-label-x"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>

        {barHover && (
          <div
            className="bar-tooltip"
            style={{ left: `${(barHover.x / WIDTH) * 100}%` }}
          >
            <div className="tooltip-header">{barHover.name}</div>
            <div className="tooltip-row">
              <span>{barHover.value.toLocaleString()} vehicles</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================
// VEHICLE DISTRIBUTION – SOC STYLE
// ================================
export function VehicleDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const SIZE = 220;
  const CENTER = SIZE / 2;
  const OUTER_RADIUS = 85;
  const INNER_RADIUS = 52;

  const COLORS = {
    Car: "#3b82f6",
    Auto: "#f59e0b",
    Bike: "#8b5cf6",
    Bus: "#10b981",
    Truck: "#ef4444",
  };

  const total = data.reduce((sum, d) => sum + d.count, 0);

  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sliceAngle = (d.count / total) * Math.PI * 2;
    const start = angle;
    const end = angle + sliceAngle;
    angle = end;

    return {
      ...d,
      start,
      end,
      color: COLORS[d.name],
    };
  });

  const arcPath = (start, end) => {
    const largeArc = end - start > Math.PI ? 1 : 0;

    const x1 = CENTER + OUTER_RADIUS * Math.cos(start);
    const y1 = CENTER + OUTER_RADIUS * Math.sin(start);
    const x2 = CENTER + OUTER_RADIUS * Math.cos(end);
    const y2 = CENTER + OUTER_RADIUS * Math.sin(end);

    const x3 = CENTER + INNER_RADIUS * Math.cos(end);
    const y3 = CENTER + INNER_RADIUS * Math.sin(end);
    const x4 = CENTER + INNER_RADIUS * Math.cos(start);
    const y4 = CENTER + INNER_RADIUS * Math.sin(start);

    return `
      M ${x1} ${y1}
      A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  const [hoverSlice, setHoverSlice] = useState(null);

  return (
    <div className="chart-container">
      <h3>Vehicle Distribution</h3>

      <div className="donut-chart-wrapper">
        <svg width={SIZE} height={SIZE}>
          {slices.map((s, i) => (
            <path
              key={i}
              d={arcPath(s.start, s.end)}
              fill={s.color}
              opacity={
                hoverSlice && hoverSlice.name !== s.name ? 0.6 : 0.95
              }
              className="donut-segment"
              onMouseMove={() =>
                setHoverSlice({
                  name: s.name,
                  value: s.value,
                  count: s.count,
                })
              }
              onMouseLeave={() => setHoverSlice(null)}
            />
          ))}

          {/* Center */}
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="#020617" />

          <text
            x={CENTER}
            y={CENTER - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
          >
            Total Vehicles
          </text>
          <text
            x={CENTER}
            y={CENTER + 20}
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize="24"
            fontWeight="700"
          >
            {total.toLocaleString()}
          </text>
        </svg>

        {/* Legend */}
        <div className="donut-legend">
          {data.map((d) => (
            <div key={d.name} className="donut-legend-item">
              <span
                className="donut-legend-color"
                style={{ background: COLORS[d.name] }}
              />
              <span className="donut-legend-name">
                {d.name} ({d.value}%)
              </span>
            </div>
          ))}
        </div>

        {hoverSlice && (
          <div className="donut-tooltip">
            <div className="tooltip-header">{hoverSlice.name}</div>
            <div className="tooltip-row">
              <span>{hoverSlice.count.toLocaleString()} vehicles</span>
            </div>
            <div className="tooltip-row">
              <span>{hoverSlice.value}% of total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ========================================================
   DATA TABLE
======================================================== */
export function VehicleDataTable({ data, loading }) {
  if (loading) return <LoadingSkeleton count={5} />;

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {["Time", "Bike", "Car", "Auto", "Bus", "Truck", "Total"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>{r.time}</td>
                <td>{r.Bike}</td>
                <td>{r.Car}</td>
                <td>{r.Auto}</td>
                <td>{r.Bus}</td>
                <td>{r.Truck}</td>
                <td className="total-cell">{r.Total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
