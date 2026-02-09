import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VehicleOverview from "../components/VehicleOverview";
import CctvTimeline from "../components/CctvTimeline";

function Events() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const records = state?.records || [];

  /* ===============================
     SAFETY CHECK
  =============================== */
  if (!records.length) {
    return (
      <div className="dashboard">
        <p className="status-empty">
          No CCTV data available. Please search again.
        </p>

        <button
          className="search-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  /* ===============================
     LATEST VEHICLE SNAPSHOT
  =============================== */
  const latest = records[records.length - 1];

  return (
    <div className="dashboard">

      {/* BACK BUTTON */}
      <div className="section">
        <button
          className="search-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* VEHICLE OVERVIEW (ONLY HERE) */}
      <div className="section">
        <div className="section-title">
          🚗 Vehicle Overview
        </div>

        <VehicleOverview
          vehicle={{
            vehicleId: latest.vehicleId,
            timestamp: latest.timestamp,
            lat: latest.lat,
            lng: latest.lng,
            area: latest.area,
            alerts: latest.alerts
          }}
        />
      </div>

      {/* CCTV TIMELINE */}
      <CctvTimeline records={records} />

    </div>
  );
}

export default Events;
