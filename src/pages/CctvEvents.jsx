import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaVideo } from "react-icons/fa6";
import CctvTimeline from "../components/CctvTimeline";

function CctvEvents() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const records = state?.records || [];
  const vehicleId = records[0]?.vehicleId || "Unknown";

  /* ===============================
     EMPTY / INVALID STATE
  =============================== */
  if (records.length === 0) {
    return (
      <div className="dashboard">
        <div className="section">
          <p className="status-empty">
            No CCTV event data available.
          </p>

          <button
            className="search-btn"
            onClick={() => navigate("/")}
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ===============================
     EVENTS PAGE
  =============================== */
  return (
    <div className="dashboard">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <button
          className="search-btn"
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Summary */}
      <div className="section" style={{ marginBottom: 24 }}>
        <div className="section-title">
          <FaVideo className="section-icon" /> CCTV Events Timeline
        </div>

        <p style={{ color: "#94a3b8", fontSize: 14 }}>
          {records.length} CCTV detections recorded for vehicle{" "}
          <strong style={{ color: "#e5e7eb" }}>{vehicleId}</strong>.
        </p>
      </div>

      {/* Timeline */}
      <CctvTimeline records={records} />
    </div>
  );
}

export default CctvEvents;
