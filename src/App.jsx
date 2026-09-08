import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import FacultyReviewPanel from "./pages/Faculty/FacultyReviewPanel";
import IpFilingTracker from "./pages/IpFilingTracker";

// Protected Route Component for Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "IP_CELL") {
      return <Navigate to="/ip-tracker" replace />;
    } else if (user.role === "FACULTY" || user.role === "ADMIN") {
      return <Navigate to="/faculty/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

// Root Redirect Helper based on RBAC
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "IP_CELL") {
    return <Navigate to="/ip-tracker" replace />;
  }
  if (user.role === "FACULTY" || user.role === "ADMIN") {
    return <Navigate to="/faculty/dashboard" replace />;
  }
  return <Navigate to="/student/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={["FACULTY", "IP_CELL", "ADMIN"]}>
                <FacultyReviewPanel />
              </ProtectedRoute>
            }
          />

          {/* IP Filing Tracker */}
          <Route
            path="/ip-tracker"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "FACULTY", "IP_CELL", "ADMIN"]}>
                <IpFilingTracker />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}