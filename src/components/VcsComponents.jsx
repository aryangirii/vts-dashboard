import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./VcsComponents.css";

/* ========================================================
   CONSTANTS
======================================================== */
const VEHICLE_TYPES = ["Car", "Auto", "Bike", "Bus", "Truck"];

const VEHICLE_COLORS = {
  Car: "#06b6d4",
  Auto: "#f59e0b",
  Bike: "#a855f7",
  Bus: "#10b981",
  Truck: "#ef4444",
};

/* ========================================================
   LOADING SKELETON
======================================================== */
export function LoadingSkeleton({ count = 1, height = "40px" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="soc-skeleton"
          style={{ height, marginBottom: 8 }}
        />
      ))}
    </>
  );
}

/* ========================================================
   ANIMATED NUMBER
======================================================== */
function useAnimatedNumber(value, duration = 500) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let frame;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) frame = requestAnimationFrame(step);
      else prev.current = to;
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

/* ========================================================
   KPI CARDS
======================================================== */
const KPI_CONFIG = [
  {
    key: "totalVehicles",
    label: "Total Vehicles",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 17a2 2 0 104 0 2 2 0 10-4 0zM13 17a2 2 0 104 0 2 2 0 10-4 0z" />
        <path d="M5 17H3V6a1 1 0 011-1h9v12M10 17h4M18 17h2a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0016.52 7H15v10" />
      </svg>
    ),
    color: "var(--soc-accent)",
    format: (v) => Math.round(v).toLocaleString(),
  },
  {
    key: "dominantType",
    label: "Dominant Vehicle Type",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    color: "#f59e0b",
    format: (v) => v,
  },
  {
    key: "peakTrafficTime",
    label: "Peak Traffic Time",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: "#10b981",
    format: (v) => v,
  },
  {
    key: "avgConfidence",
    label: "Avg Detection Confidence",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    color: "#06b6d4",
    format: (v) => (typeof v === "number" ? v.toFixed(1) + "%" : v),
  },
];

export function KPICards({ data, loading }) {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card kpi-card">
            <LoadingSkeleton height="72px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      {KPI_CONFIG.map((kpi, i) => (
        <KPICard key={kpi.key} kpi={kpi} value={data[kpi.key]} index={i} />
      ))}
    </div>
  );
}

function KPICard({ kpi, value, index }) {
  const isNumeric = typeof value === "number";
  const animatedVal = useAnimatedNumber(isNumeric ? value : 0);
  const displayVal = isNumeric ? kpi.format(animatedVal) : kpi.format(value);

  return (
    <motion.div
      className="glass-card kpi-card hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
    >
      <div className="kpi-icon" style={{ color: kpi.color }}>
        {kpi.icon}
      </div>
      <div className="kpi-content">
        <span className="kpi-label">{kpi.label}</span>
        <span className="kpi-value" style={{ color: kpi.color }}>
          {displayVal}
        </span>
      </div>
    </motion.div>
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
      <div className="filter-group">
        <label className="filter-label">Camera</label>
        <select
          className="soc-select"
          value={selectedCamera}
          onChange={(e) => onCameraChange(e.target.value)}
        >
          {cameras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">From</label>
        <input
          type="date"
          className="soc-input"
          value={dateFrom}
          onChange={(e) => onDateChange("from", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">To</label>
        <input
          type="date"
          className="soc-input"
          value={dateTo}
          onChange={(e) => onDateChange("to", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Grouping</label>
        <select
          className="soc-select"
          value={timeGrouping}
          onChange={(e) => onTimeGroupingChange(e.target.value)}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="filter-presets">
        {[
          { key: "today", label: "Today" },
          { key: "7days", label: "7 Days" },
          { key: "30days", label: "30 Days" },
        ].map((p) => (
          <button
            key={p.key}
            className="preset-btn"
            onClick={() => onPresetClick(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========================================================
   CUSTOM RECHARTS TOOLTIP
======================================================== */
function SOCTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="soc-tooltip">
      <div className="soc-tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="soc-tooltip-row">
          <span
            className="soc-tooltip-dot"
            style={{ background: entry.color }}
          />
          <span className="soc-tooltip-name">{entry.name}</span>
          <span className="soc-tooltip-val">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ========================================================
   VEHICLE TRAFFIC TREND (LINE CHART)
======================================================== */
export function VehicleTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No trend data available</div>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke="rgba(148,163,184,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="#475569"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#334155" }}
            axisLine={{ stroke: "#334155" }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#334155" }}
            axisLine={{ stroke: "#334155" }}
            width={50}
          />
          <Tooltip content={<SOCTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }}
          />
          {VEHICLE_TYPES.map((type) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              stroke={VEHICLE_COLORS[type]}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: VEHICLE_COLORS[type] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========================================================
   VEHICLE CATEGORY BAR CHART
======================================================== */
export function VehicleCategoryChart({ data }) {
  const totals = useMemo(() => {
    if (!data?.length) return [];
    const sums = { Car: 0, Auto: 0, Bike: 0, Bus: 0, Truck: 0 };
    data.forEach((d) =>
      VEHICLE_TYPES.forEach((k) => {
        sums[k] += d[k] || 0;
      })
    );
    return VEHICLE_TYPES.map((name) => ({
      name,
      count: sums[name],
      fill: VEHICLE_COLORS[name],
    }));
  }, [data]);

  if (!totals.length) return <div className="chart-empty">No category data</div>;

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={totals} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke="rgba(148,163,184,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#475569"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#334155" }}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={{ stroke: "#334155" }}
            axisLine={{ stroke: "#334155" }}
            width={50}
          />
          <Tooltip content={<SOCTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
          <Bar
            dataKey="count"
            name="Vehicles"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            {totals.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========================================================
   VEHICLE DISTRIBUTION (DONUT CHART)
======================================================== */
export function VehicleDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No distribution data</div>;
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="donut-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            dataKey="count"
            nameKey="name"
            strokeWidth={2}
            stroke="hsl(222,47%,6%)"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={VEHICLE_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<SOCTooltip />} />
          {/* Center label rendered via SVG */}
          <text
            x="50%"
            y="46%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#64748b"
            fontSize={11}
          >
            Total
          </text>
          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#e2e8f0"
            fontSize={22}
            fontWeight="700"
          >
            {total.toLocaleString()}
          </text>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="donut-legend">
        {data.map((d) => (
          <div key={d.name} className="donut-legend-item">
            <span
              className="donut-legend-color"
              style={{ background: VEHICLE_COLORS[d.name] }}
            />
            <span className="donut-legend-name">{d.name}</span>
            <span className="donut-legend-count">{d.count.toLocaleString()}</span>
            <span className="donut-legend-pct">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================
   DATA TABLE WITH PAGINATION, SEARCH, EXPORT
======================================================== */
const PAGE_SIZE = 12;

export function VehicleDataTable({ data, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("time");
  const [sortDir, setSortDir] = useState("asc");

  // Reset page on data/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    let rows = data;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter((r) => r.time.toLowerCase().includes(term));
    }
    // Sort
    rows = [...rows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return rows;
  }, [data, searchTerm, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Time", "Bike", "Car", "Auto", "Bus", "Truck", "Total"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((r) =>
        [r.time, r.Bike, r.Car, r.Auto, r.Bus, r.Truck, r.Total].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vcs-vehicle-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSkeleton count={6} height="36px" />;

  const COLUMNS = [
    { key: "time", label: "Time" },
    { key: "Bike", label: "Bike" },
    { key: "Car", label: "Car" },
    { key: "Auto", label: "Auto" },
    { key: "Bus", label: "Bus" },
    { key: "Truck", label: "Truck" },
    { key: "Total", label: "Total" },
  ];

  return (
    <div className="table-container">
      {/* Controls */}
      <div className="table-controls">
        <input
          type="text"
          className="soc-input table-search"
          placeholder="Search by time..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="export-btn" onClick={handleExportCSV}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="soc-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={sortKey === col.key ? "sorted" : ""}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="sort-arrow">
                      {sortDir === "asc" ? " \u25B2" : " \u25BC"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr key={i}>
                  <td className="time-cell">{row.time}</td>
                  <td>{row.Bike.toLocaleString()}</td>
                  <td>{row.Car.toLocaleString()}</td>
                  <td>{row.Auto.toLocaleString()}</td>
                  <td>{row.Bus.toLocaleString()}</td>
                  <td>{row.Truck.toLocaleString()}</td>
                  <td className="total-cell">{row.Total.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <span className="pagination-info">
          Showing {(currentPage - 1) * PAGE_SIZE + 1}--
          {Math.min(currentPage * PAGE_SIZE, filteredData.length)} of{" "}
          {filteredData.length} records
        </span>
        <div className="pagination-btns">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return (
              <button
                key={page}
                className={`pagination-btn ${
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
