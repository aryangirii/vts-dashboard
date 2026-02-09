import React from "react";
import "./VehicleOverview.css";

function formatIST(ts) {
  if (!ts || isNaN(ts)) return "—";

  // detect seconds vs milliseconds
  const ms = ts < 1e12 ? ts * 1000 : ts;

  try {
    return new Date(ms).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });
  } catch {
    return "—";
  }
}

function VehicleOverview({ vehicle }) {
  if (!vehicle) return null;

  const {
    vehicleId = "—",
    timestamp,
    last_seen,
    lat,
    lng,
    area = "Unknown",
    alerts = {}
  } = vehicle;

  const activeAlerts = Object.keys(alerts).filter(
    key => alerts[key]
  );

  return (
    <div className="vehicle-overview-grid">

      <div className="overview-item">
        <span className="label">Vehicle ID</span>
        <span className="value">{vehicleId}</span>
      </div>

      <div className="overview-item">
        <span className="label">Last Seen (IST)</span>
        <span className="value">
          {formatIST(timestamp ?? last_seen)}
        </span>
      </div>

      <div className="overview-item">
        <span className="label">Current Area</span>
        <span className="value">{area}</span>
      </div>

      <div className="overview-item">
        <span className="label">Latitude</span>
        <span className="value">
          {Number.isFinite(lat) ? lat.toFixed(6) : "—"}
        </span>
      </div>

      <div className="overview-item">
        <span className="label">Longitude</span>
        <span className="value">
          {Number.isFinite(lng) ? lng.toFixed(6) : "—"}
        </span>
      </div>

      <div className="overview-item full">
        <span className="label">Active Alerts</span>
        <span
          className={
            activeAlerts.length
              ? "alert-badge danger"
              : "alert-badge safe"
          }
        >
          {activeAlerts.length
            ? activeAlerts.join(", ")
            : "No active alerts"}
        </span>
      </div>

    </div>
  );
}

export default VehicleOverview;
