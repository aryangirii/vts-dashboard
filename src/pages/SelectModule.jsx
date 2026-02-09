import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCar, FaChartLine } from "react-icons/fa6";
import "./SelectModule.css";

function SelectModule() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const iconMap = {
    vts: FaCar,
    vcs: FaChartLine,
  };

  const systems = [
    {
      id: "vts",
      title: "Vehicle Tracking System",
      shortTitle: "VTS",
      description: "Real-time vehicle monitoring, GPS tracking, and fleet management",
      icon: iconMap.vts,
      path: "/vts",
      color: "primary",
    },
    {
      id: "vcs",
      title: "Vehicle Classification System",
      shortTitle: "VCS",
      description: "Vehicle type detection, classification analytics, and insights",
      icon: iconMap.vcs,
      path: "/vcs",
      color: "secondary",
    },
  ];

  const handleSystemSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="select-module-container">
      <div className="select-module-header">
        <h1 className="select-module-title">Select System</h1>
        <p className="select-module-subtitle">Welcome, {user?.username}</p>
      </div>

      <div className="systems-grid">
        {systems.map((system) => (
          <div
            key={system.id}
            className={`system-card system-card-${system.color}`}
          >
            <div className="system-icon">
              {React.createElement(system.icon, { className: "system-icon-svg" })}
            </div>
            <h2 className="system-title">{system.title}</h2>
            <p className="system-description">{system.description}</p>
            <button
              className={`system-button system-button-${system.color}`}
              onClick={() => handleSystemSelect(system.path)}
            >
              Open System
            </button>
          </div>
        ))}
      </div>

      <div className="select-module-footer">
        <button className="logout-btn" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SelectModule;
