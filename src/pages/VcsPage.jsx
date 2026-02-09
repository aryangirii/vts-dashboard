import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

import {
  FilterPanel,
  KPICards,
  VehicleTrendChart,
  VehicleCategoryChart,
  VehicleDistributionChart,
  VehicleDataTable,
} from "../components/VcsComponents";

import mockVcsData from "../data/mockVcsData";
import { processVcsData } from "../utils/vcsDataProcessor";
import "./VcsPage.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function VcsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-02-08");
  const [dateTo, setDateTo] = useState("2026-02-08");
  const [timeGrouping, setTimeGrouping] = useState("hourly");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCamera, dateFrom, dateTo, timeGrouping]);

  const handleDateChange = (type, value) => {
    type === "from" ? setDateFrom(value) : setDateTo(value);
  };

  const handlePresetClick = (preset) => {
    const today = new Date("2026-02-08");
    const from = new Date(today);

    if (preset === "today") {
      setDateFrom("2026-02-08");
      setDateTo("2026-02-08");
    }
    if (preset === "7days") {
      from.setDate(from.getDate() - 7);
      setDateFrom(from.toISOString().split("T")[0]);
      setDateTo("2026-02-08");
    }
    if (preset === "30days") {
      from.setDate(from.getDate() - 30);
      setDateFrom(from.toISOString().split("T")[0]);
      setDateTo("2026-02-08");
    }
  };

  const dashboardData = useMemo(
    () =>
      processVcsData(mockVcsData, {
        dateFrom,
        dateTo,
        cameraId: selectedCamera,
        timeGrouping,
      }),
    [selectedCamera, dateFrom, dateTo, timeGrouping]
  );

  return (
    <div className="vcs-page">
      {/* Header */}
      <header className="vcs-header">
        <div className="vcs-header-inner">
          <div className="vcs-header-left">
            <button
              className="vcs-back-btn"
              onClick={() => navigate("/select-module")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div className="vcs-header-titles">
              <h1 className="vcs-page-title">Vehicle Classification System</h1>
              <p className="vcs-page-subtitle">Real-time traffic analytics & vehicle detection intelligence</p>
            </div>
          </div>
          <div className="vcs-header-right">
            <div className="vcs-live-indicator">
              <span className="live-dot" />
              <span className="live-text">LIVE</span>
            </div>
            <span className="vcs-timestamp">
              {new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="vcs-main">
        {/* Filter Bar */}
        <motion.section
          className="vcs-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="glass-card">
            <FilterPanel
              selectedCamera={selectedCamera}
              onCameraChange={setSelectedCamera}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={handleDateChange}
              timeGrouping={timeGrouping}
              onTimeGroupingChange={setTimeGrouping}
              cameras={dashboardData.cameras}
              onPresetClick={handlePresetClick}
            />
          </div>
        </motion.section>

        {/* KPI Cards */}
        <motion.section
          className="vcs-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <KPICards data={dashboardData.summaryCards} loading={loading} />
        </motion.section>

        {/* Vehicle Traffic Trend */}
        <motion.section
          className="vcs-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="glass-card">
            <h2 className="section-title">Vehicle Traffic Trend</h2>
            <VehicleTrendChart data={dashboardData.vehiclesByTime} />
          </div>
        </motion.section>

        {/* Two-column: Categories + Distribution */}
        <motion.section
          className="vcs-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="vcs-chart-grid">
            <div className="glass-card">
              <h2 className="section-title">Vehicle Categories</h2>
              <VehicleCategoryChart data={dashboardData.vehiclesByTime} />
            </div>
            <div className="glass-card">
              <h2 className="section-title">Vehicle Distribution</h2>
              <VehicleDistributionChart data={dashboardData.vehicleDistribution} />
            </div>
          </div>
        </motion.section>

        {/* Data Table */}
        <motion.section
          className="vcs-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <div className="glass-card">
            <h2 className="section-title">CCTV Vehicle Timeline</h2>
            <VehicleDataTable data={dashboardData.vehicleTable} loading={loading} />
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="vcs-footer">
          <p>Data last refreshed: {new Date().toLocaleString()}</p>
          <p>Vehicle Classification System v2.0 -- All data is simulated for demonstration</p>
        </footer>
      </main>
    </div>
  );
}

export default VcsPage;
