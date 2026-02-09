import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaMapPin,
  FaClock,
  FaCar,
  FaMagnifyingGlass,
  FaMap,
  FaChartLine,
  FaSpinner,
  FaTriangleExclamation,
  FaCircleInfo,
  FaArrowLeft
} from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import SearchPanel from "../components/SearchPanel";
import MapView from "../components/MapView";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { fetchVehicleHistory } from "../api/vehicleApi";
import { normalizeRecords } from "../utils/normalizeRecords";

// ✅ LOGO IMPORT
import ZeexLogo from "../assets/zeex-ai-logo.png";

const STORAGE_KEY = "cctv-dashboard-state";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedVehicle, setSearchedVehicle] = useState("");

  /* ===============================
     RESTORE STATE
  =============================== */
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setResults(parsed.results || []);
      setSearchedVehicle(parsed.vehicleId || "");
      if (parsed.results?.length) setHasSearched(true);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /* ===============================
     SEARCH HANDLER
  =============================== */
  const handleSearch = async ({ vehicleId, fromDate, toDate }) => {
    if (!vehicleId) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setSearchedVehicle(vehicleId);

    try {
      const rawHistory = await fetchVehicleHistory(
        vehicleId,
        fromDate || null,
        toDate || null
      );

      const normalized = normalizeRecords(rawHistory, 20)
        .filter(r => Number.isFinite(r.lat) && Number.isFinite(r.lng))
        .sort((a, b) => a.timestamp - b.timestamp);

      setResults(normalized);

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ results: normalized, vehicleId })
      );

    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicle data.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     COMPUTE METRICS (from real data)
  =============================== */
  const metrics = {
    detections: results.length,
    locations: results.length > 0 
      ? new Set(results.map(r => `${r.lat},${r.lng}`)).size 
      : 0,
    timeSpan: results.length > 1 
      ? Math.round((results[results.length - 1].timestamp - results[0].timestamp) / 60000) 
      : 0,
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="dashboard command-center">
      {/* Professional Header */}
      <header className="dashboard-header">
        <button
          className="dashboard-back-btn"
          onClick={() => navigate("/select-module")}
          title="Back to Systems"
        >
          <FaArrowLeft className="back-icon" />
          <span>Back</span>
        </button>

        <div className="header-branding">
          <img
            src={ZeexLogo}
            alt="ZEEX AI"
            className="header-logo"
          />
          <div className="header-titles">
            <h1 className="dashboard-page-title">Command Center</h1>
            <p className="dashboard-page-subtitle">Real-time vehicle tracking & CCTV intelligence</p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="header-controls">
          <button
            className="header-control-btn theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="header-control-btn system-switch"
            onClick={() => navigate("/select-module")}
            title="Switch System"
          >
            🔄
          </button>
          <button
            className="header-control-btn logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Sign Out"
          >
            🚪
          </button>
        </div>
      </header>

      {/* ================= METRICS CARDS ================= */}
      {hasSearched && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box">
              <FaVideo className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">CCTV Detections</div>
              <div className="metric-value">{metrics.detections}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box">
              <FaMapPin className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Unique Locations</div>
              <div className="metric-value">{metrics.locations}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box">
              <FaClock className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Time Span (min)</div>
              <div className="metric-value">{metrics.timeSpan}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box">
              <FaCar className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Vehicle ID</div>
              <div className="metric-value">{searchedVehicle}</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VEHICLE INVESTIGATION ================= */}
      <div className="section cc-section">
        <div className="section-header">
          <FaMagnifyingGlass className="section-icon" />
          <h2 className="section-title">Vehicle Investigation</h2>
        </div>
        
        {loading && (
          <LoadingSkeleton variant="form" />
        )}

        {!loading && (
          <SearchPanel onSearch={handleSearch} loading={loading} />
        )}

        {loading && (
          <p className="status-loading"><FaSpinner className="inline-icon" /> Analyzing CCTV data…</p>
        )}

        {error && (
          <p className="status-error"><FaTriangleExclamation className="inline-icon" /> {error}</p>
        )}
      </div>

      {/* ================= MOVEMENT MAP ================= */}
      {loading && (
        <div className="section cc-section">
          <div className="section-header">
            <FaMap className="section-icon" />
            <h2 className="section-title">Vehicle Movement Timeline</h2>
          </div>
          <div className="map-wrapper" style={{ height: "420px" }}>
            <LoadingSkeleton variant="table" count={1} />
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="section cc-section">
          <div className="section-header">
            <FaMap className="section-icon" />
            <h2 className="section-title">Vehicle Movement Timeline</h2>
          </div>

          <div className="map-wrapper">
            <MapView records={results} />
          </div>

          {results.length === 1 && (
            <p className="status-empty">
              Only last known location available.
            </p>
          )}
        </div>  
      )}

      {/* ================= CCTV SUMMARY ================= */}
      {!loading && results.length > 0 && (
        <div className="section cc-section">
          <div className="section-header">
            <FaChartLine className="section-icon" />
            <h2 className="section-title">CCTV Events Summary</h2>
          </div>

          <p className="summary-text">
            {results.length} CCTV detection{results.length !== 1 ? 's' : ''} recorded
            {searchedVehicle ? ` for vehicle <strong>${searchedVehicle}</strong>` : ''}.
          </p>

          <button
            className="search-btn action-btn"
            onClick={() =>
              navigate("/events", {
                state: { records: results }
              })
            }
          >
            View Detailed CCTV Timeline
          </button>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="section cc-section empty-state">
          <p className="status-empty">
            <FaCircleInfo className="inline-icon" /> No CCTV sightings found for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

