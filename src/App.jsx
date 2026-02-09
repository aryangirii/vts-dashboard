import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SelectModule from "./pages/SelectModule";
import Dashboard from "./pages/Dashboard";
import CctvEvents from "./pages/CctvEvents";
import VcsPage from "./pages/VcsPage";

function App() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg, #0f172a)",
          color: "var(--text, #e5e7eb)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #1e293b",
              borderTopColor: "#0ea5e9",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default redirect based on auth state */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/select-module" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/select-module"
        element={
          <ProtectedRoute>
            <SelectModule />
          </ProtectedRoute>
        }
      />

      {/* VTS System */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/vts"
          element={
            <div className={`page-transition ${!isTransitioning ? 'page-visible' : ''}`}>
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/vts/events"
          element={
            <div className={`page-transition ${!isTransitioning ? 'page-visible' : ''}`}>
              <CctvEvents />
            </div>
          }
        />
        {/* Keep legacy routes for backward compatibility */}
        <Route
          path="/dashboard"
          element={
            <div className={`page-transition ${!isTransitioning ? 'page-visible' : ''}`}>
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/events"
          element={
            <div className={`page-transition ${!isTransitioning ? 'page-visible' : ''}`}>
              <CctvEvents />
            </div>
          }
        />
      </Route>

      {/* VCS System */}
      <Route
        path="/vcs"
        element={
          <ProtectedRoute>
            <VcsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
