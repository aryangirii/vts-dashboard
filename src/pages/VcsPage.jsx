import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FilterPanel,
  SummaryCards,
  VehicleTrendChart,
  VehicleCategoryChart,
  VehicleDistributionChart,
  VehicleDataTable,
} from "../components/VcsComponents";

import mockVcsData from "../data/mockVcsData";
import { processVcsData } from "../utils/vcsDataProcessor";
import "./VcsPage.css";

function VcsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-02-08");
  const [dateTo, setDateTo] = useState("2026-02-08");
  const [timeGrouping, setTimeGrouping] = useState("hourly");

  /* Simulated loading */
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
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
      {/* ================= Header ================= */}
      <header className="vcs-header">
        <div className="vcs-header-top">
          <button
            className="vcs-back-btn"
            onClick={() => navigate("/select-module")}
          >
            ← Back
          </button>
        </div>

        <div className="vcs-header-content">
          <h1 className="vcs-page-title">Vehicle Classification System</h1>
          <p className="vcs-page-subtitle">
            Real-time traffic analytics & vehicle insights
          </p>
        </div>
      </header>

      {/* ================= Main Content ================= */}
      <main className="vcs-main">
        {/* 1. Unified Filter Bar */}
        <section className="vcs-section">
          <div className="vcs-card">
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
        </section>

        {/* 2. KPI Summary Cards */}
        <section className="vcs-section">
          <SummaryCards
            data={dashboardData.summaryCards}
            loading={loading}
          />
        </section>

        {/* 3. Vehicle Traffic Trend (full width) */}
        <section className="vcs-section">
          <VehicleTrendChart
            data={dashboardData.vehiclesByTime}
          />
        </section>

        {/* 4. Two-column charts: Categories (L) + Distribution (R) */}
        <section className="vcs-section">
          <div className="vcs-chart-grid">
            <VehicleCategoryChart
              data={dashboardData.vehiclesByTime}
            />

            <VehicleDistributionChart
              data={dashboardData.vehicleDistribution}
            />
          </div>
        </section>

        {/* 5. Detailed Vehicle Data table */}
        <section className="vcs-section">
          <div className="vcs-card">
            <h2 className="section-title">Detailed Vehicle Data</h2>

            <VehicleDataTable
              data={dashboardData.vehicleTable}
              loading={loading}
            />
          </div>
        </section>

        {/* ================= Footer ================= */}
        <footer className="vcs-footer">
          <p>Data last updated: {new Date().toLocaleString()}</p>
          <p>All data is simulated for demonstration purposes</p>
        </footer>
      </main>
    </div>
  );
}

export default VcsPage;
