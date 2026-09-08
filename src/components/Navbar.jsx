import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layers,
  GraduationCap,
  Award,
  FileCheck,
  LogOut,
  UserCheck,
  Sparkles,
  ShieldAlert
} from "lucide-react";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleQuickSwitch = (role) => {
    if (role === "STUDENT") {
      const studentUser = {
        id: 1,
        name: "Alex Johnson",
        email: "alex.student@campus.edu",
        role: "STUDENT",
        department: "Computer Science & Engineering",
      };
      login(studentUser);
      navigate("/student/dashboard");
    } else if (role === "FACULTY") {
      const facultyUser = {
        id: 3,
        name: "Dr. Robert Vance",
        email: "robert.faculty@campus.edu",
        role: "FACULTY",
        department: "Computer Science & Engineering",
      };
      login(facultyUser);
      navigate("/faculty/dashboard");
    } else if (role === "IP_CELL") {
      const ipUser = {
        id: 5,
        name: "Institutional IP Cell Officer",
        email: "ipcell@campus.edu",
        role: "IP_CELL",
        department: "Institutional IP Cell & Tech Transfer",
      };
      login(ipUser);
      navigate("/ip-tracker");
    }
  };

  const navItems = [
    { label: "Student Portal", path: "/student/dashboard", icon: GraduationCap, allowed: ["STUDENT", "ADMIN"] },
    { label: "Faculty Review", path: "/faculty/dashboard", icon: FileCheck, allowed: ["FACULTY", "ADMIN"] },
    { label: "IP Cell Tracker", path: "/ip-tracker", icon: Award, allowed: ["STUDENT", "FACULTY", "IP_CELL", "ADMIN"] },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#0F172A",
        borderBottom: "1px solid #1E293B",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Brand Logo & Name */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)",
            }}
          >
            <Layers size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "19px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
                InnoFlow
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  color: "#818CF8",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>
              Research Lifecycle &amp; IP Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: isActive ? "rgba(37, 99, 235, 0.2)" : "transparent",
                    color: isActive ? "#60A5FA" : "#94A3B8",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#94A3B8";
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Demo Quick Switcher & User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Quick Persona Switcher for Evaluation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#1E293B",
              padding: "3px 6px",
              borderRadius: "8px",
              border: "1px solid #334155",
            }}
          >
            <span style={{ fontSize: "11px", color: "#64748B", padding: "0 4px", fontWeight: 600 }}>Demo:</span>
            <button
              onClick={() => handleQuickSwitch("STUDENT")}
              title="Switch to Student Alex Johnson"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 7px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: user?.role === "STUDENT" ? "#2563EB" : "transparent",
                color: user?.role === "STUDENT" ? "#FFFFFF" : "#94A3B8",
              }}
            >
              Student
            </button>
            <button
              onClick={() => handleQuickSwitch("FACULTY")}
              title="Switch to Mentor Dr. Robert Vance"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 7px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: user?.role === "FACULTY" ? "#059669" : "transparent",
                color: user?.role === "FACULTY" ? "#FFFFFF" : "#94A3B8",
              }}
            >
              Faculty
            </button>
            <button
              onClick={() => handleQuickSwitch("IP_CELL")}
              title="Switch to Institutional IP Cell Officer"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 7px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: user?.role === "IP_CELL" ? "#7C3AED" : "transparent",
                color: user?.role === "IP_CELL" ? "#FFFFFF" : "#94A3B8",
              }}
            >
              IP Cell
            </button>
          </div>

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor:
                      user.role === "FACULTY"
                        ? "#059669"
                        : user.role === "IP_CELL"
                        ? "#7C3AED"
                        : "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94A3B8", lineHeight: 1 }}>
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  backgroundColor: "transparent",
                  color: "#94A3B8",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1E293B";
                  e.currentTarget.style.color = "#EF4444";
                  e.currentTarget.style.borderColor = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.borderColor = "#334155";
                }}
              >
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
