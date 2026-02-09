import React, { useState } from "react";
import "./SearchPanel.css";

function SearchPanel({ onSearch, loading }) {
  const [vehicleId, setVehicleId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ===============================
     QUICK DATE PRESETS (ADD ONLY)
  =============================== */
  function applyPreset(hours) {
    const to = new Date();
    const from = new Date();
    from.setHours(to.getHours() - hours);

    setFromDate(from.toISOString().slice(0, 16));
    setToDate(to.toISOString().slice(0, 16));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSearch({ vehicleId, fromDate, toDate });
  };

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      {/* VEHICLE ID */}
      <div className="search-group">
        <label>Vehicle ID / Number Plate</label>
        <input
          type="text"
          placeholder="e.g. VH-109"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          required
        />
      </div>

      {/* FROM */}
      <div className="search-group">
        <label>From</label>
        <input
          type="datetime-local"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>

      {/* TO */}
      <div className="search-group">
        <label>To</label>
        <input
          type="datetime-local"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* ✅ QUICK PRESETS (NON-INTRUSIVE) */}
      <div className="preset-row">
        <button type="button" onClick={() => applyPreset(1)}>
          Last 1h
        </button>
        <button type="button" onClick={() => applyPreset(24)}>
          Last 24h
        </button>
        <button type="button" onClick={() => applyPreset(168)}>
          Last 7d
        </button>
      </div>

      {/* SEARCH BUTTON */}
      <button
        type="submit"
        className="search-btn"
        disabled={loading}
      >
        {loading ? "Searching…" : "🔍 Investigate Vehicle"}
      </button>
    </form>
  );
}

export default SearchPanel;
