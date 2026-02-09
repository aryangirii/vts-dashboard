import React from "react";
import { FaClock } from "react-icons/fa6";
import "./CctvTimeline.css";
import { formatIST } from "../utils/timeFormat";

function CctvTimeline({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="section">
        <p className="status-empty">No CCTV sightings found.</p>
      </div>
    );
  }

  // 🔥 FILTER CCTV EVENTS (camera present)
  const cctvRecords = records.filter(
    (r) => r.camera_id !== undefined
  );

  if (cctvRecords.length === 0) {
    return (
      <div className="section">
        <p className="status-empty">No CCTV sightings found.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <FaClock size={20} style={{ color: "#38bdf8" }} />
        <div className="section-title">CCTV Sightings Timeline</div>
      </div>

      <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>
        All timestamps are shown in Indian Standard Time (IST)
      </p>

      <p style={{ color: "#94a3b8", fontSize: 13 }}>
        {cctvRecords.length} CCTV detections recorded for this vehicle.
      </p>

      <div className="table-wrapper">
        <table className="timeline-table">
          <thead>
            <tr>
              <th>Timestamp (IST)</th>
              <th>Area</th>
              <th>Camera ID</th>
              <th>Detected Object</th>
              <th>Confidence</th>
              <th>Driver</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Alerts</th>
            </tr>
          </thead>

          <tbody>
            {cctvRecords.map((item, index) => {
              // ✅ ONLY REAL ALERTS (exclude "unknown")
              const activeAlerts = item.alerts
                ? Object.keys(item.alerts).filter(
                    (k) => item.alerts[k] && item.alerts[k] !== "unknown"
                  )
                : [];

              return (
                <tr
                  key={index}
                  className={activeAlerts.length ? "alert-row" : ""}
                  style={{
                    animationDelay: `${Math.min(index * 0.05, 0.5)}s`
                  }}
                >
                  <td>{formatIST(item.timestamp)}</td>
                  <td>{item.area || "—"}</td>
                  <td>{item.camera_id}</td>
                  <td>{item.detected_object}</td>

                  <td>
                    {item.confidence !== null &&
                    !isNaN(Number(item.confidence))
                      ? `${Math.round(Number(item.confidence) * 100)}%`
                      : "—"}
                  </td>

                  <td>{item.driverName || "—"}</td>
                  <td>{item.lat != null ? Number(item.lat).toFixed(5) : "—"}</td>
                  <td>{item.lng != null ? Number(item.lng).toFixed(5) : "—"}</td>

                  {/* ✅ FINAL FIX */}
                  <td
                    className={
                      activeAlerts.length ? "cctv-alert" : "cctv-normal"
                    }
                  >
                    {activeAlerts.length > 0
                      ? activeAlerts.join(", ")
                      : "unknown"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CctvTimeline;
