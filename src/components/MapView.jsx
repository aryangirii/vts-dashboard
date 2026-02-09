import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===============================
   FIX LEAFLET DEFAULT ICON ISSUE
=============================== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* ===============================
   AUTO FIT MAP TO POINTS
=============================== */
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);

  return null;
}

/* ===============================
   MAP VIEW
=============================== */
function MapView({ records }) {
  if (!records || records.length === 0) return null;

  /* Convert records to lat/lng points */
  const points = records.map(r => [r.lat, r.lng]);

  /* Latest record */
  const last = records[records.length - 1];

  return (
    <>
      <MapContainer
        style={{
          height: 420,
          width: "100%",
          borderRadius: 12
        }}
        center={[last.lat, last.lng]}
        zoom={6}
        scrollWheelZoom
      >
        {/* Map tiles */}
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto zoom to all points */}
        <FitBounds points={points} />

        {/* Subtle movement path (optional) */}
        {points.length > 1 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#38bdf8",
              weight: 2,
              opacity: 0.4,
              dashArray: "6 6" // smooth dotted feel
            }}
          />
        )}

        {/* CCTV detections (RED DOTS) */}
        {records.map((r, i) => (
          <CircleMarker
            key={i}
            center={[r.lat, r.lng]}
            radius={6}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.9
            }}
          >
            <Popup>
              <strong>CCTV Detection</strong>
              <br />
              Area: {r.area || "—"}
              <br />
              Time:{" "}
              {r.timestamp
                ? new Date(r.timestamp * 1000).toLocaleString()
                : "—"}
            </Popup>
          </CircleMarker>
        ))}

        {/* Latest location (BLUE MARKER) */}
        <Marker position={[last.lat, last.lng]}>
          <Popup>
            <strong>Latest Location</strong>
            <br />
            Area: {last.area || "—"}
            <br />
            Time:{" "}
            {last.timestamp
              ? new Date(last.timestamp * 1000).toLocaleString()
              : "—"}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Legend */}
      <p style={{ marginTop: 10, fontSize: 13, color: "#94a3b8" }}>
        🔴 CCTV detections &nbsp;•&nbsp; 🔵 Latest location
      </p>
    </>
  );
}

export default MapView;
