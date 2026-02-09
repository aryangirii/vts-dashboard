import React from "react";

function LoadingSkeleton({ count = 3, variant = "card" }) {
  if (variant === "metric") {
    return (
      <div className="metrics-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="metric-card">
            <div className="skeleton skeleton-text" style={{ width: "32px", height: "32px", marginRight: "8px" }}></div>
            <div className="metric-content" style={{ flex: 1 }}>
              <div className="skeleton skeleton-text skeleton-line-short"></div>
              <div className="skeleton skeleton-text" style={{ marginTop: "8px" }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="search-panel">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="search-group">
            <div className="skeleton skeleton-text skeleton-line-short" style={{ marginBottom: "8px" }}></div>
            <div className="skeleton skeleton-text" style={{ height: "40px" }}></div>
          </div>
        ))}
        <div className="skeleton skeleton-text" style={{ height: "40px", marginTop: "12px" }}></div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="table-wrapper">
        <div className="skeleton skeleton-card">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>
              <div className="skeleton skeleton-text skeleton-line-short"></div>
              <div className="skeleton skeleton-text skeleton-line-medium" style={{ marginBottom: "12px" }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text skeleton-line-medium"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
