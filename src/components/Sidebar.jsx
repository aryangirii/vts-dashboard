import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaGaugeHigh,
  FaMagnifyingGlass,
  FaVideo,
  FaMapPin,
  FaTriangleExclamation,
  FaChartLine,
  FaGear,
  FaTableCellsLarge
} from "react-icons/fa6";

// Import logo
import ZeexLogo from "../assets/zeex-ai-logo.png";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { label: "Command Center", path: "/vts", icon: FaGaugeHigh },
    { label: "Vehicle Search", path: "/vts", icon: FaMagnifyingGlass },
    { label: "CCTV Events", path: "/vts/events", icon: FaVideo },
    { label: "Live Map", path: "/vts", icon: FaMapPin },
  ];

  const monitoringItems = [
    { label: "Active Alerts", path: "/vts", icon: FaTriangleExclamation },
  ];

  const systemItems = [
    { label: "Reports", path: "/vts", icon: FaChartLine },
    { label: "Settings", path: "/vts", icon: FaGear },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={ZeexLogo} alt="ZEEX AI" className="logo-img" />
        <div className="logo-text">
          <div className="logo-brand">ZEEX AI</div>
          <div className="logo-subtitle">VTS COMMAND</div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">NAVIGATION</div>
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  >
                    {/* Remove icon for Command Center so header contains only the title/subtitle text */}
                    {item.label !== "Command Center" && (
                      <IconComponent className="nav-icon" />
                    )}
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">MONITORING</div>
          <ul className="nav-list">
            {monitoringItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">SYSTEM</div>
          <ul className="nav-list">
            {systemItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-text">System Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
