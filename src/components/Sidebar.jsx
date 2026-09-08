import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ShieldCheck,
  CheckSquare,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleExit = () => {
    logout();
    navigate("/login");
  };

  const isStudent = user.role === "STUDENT";
  const isFaculty = user.role === "FACULTY";
  const isIpCell = user.role === "IP_CELL";
  const isAdmin = user.role === "ADMIN";

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 18px",
    color: isActive ? "#2563EB" : "#475569",
    backgroundColor: isActive ? "#EFF6FF" : "transparent",
    borderLeft: isActive ? "4px solid #2563EB" : "4px solid transparent",
    fontWeight: isActive ? "600" : "500",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.2s ease",
  });

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        maxWidth: "250px",
        flexShrink: 0,
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        padding: "20px 0 16px 0",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        zIndex: 90,
      }}
    >
      <div
        style={{
          padding: "0 18px 12px 18px",
          fontSize: "11px",
          fontWeight: 700,
          color: "#94A3B8",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {user.role} Navigation
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {isStudent && (
          <>
            <NavLink to="/student/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} />
              My Research Projects
            </NavLink>
            <NavLink to="/ip-tracker" style={linkStyle}>
              <ShieldCheck size={18} />
              IP &amp; Patent Tracker
            </NavLink>
          </>
        )}

        {isFaculty && (
          <>
            <NavLink to="/faculty/dashboard" style={linkStyle}>
              <CheckSquare size={18} />
              Faculty Review Panel
            </NavLink>
            <NavLink to="/ip-tracker" style={linkStyle}>
              <ShieldCheck size={18} />
              IP &amp; Patent Tracker
            </NavLink>
          </>
        )}

        {isIpCell && (
          <>
            <NavLink to="/ip-tracker" style={linkStyle}>
              <ShieldCheck size={18} />
              IP &amp; Patent Tracker
            </NavLink>
            <NavLink to="/faculty/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} />
              All Research Proposals
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/faculty/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} />
              Master Project Review
            </NavLink>
            <NavLink to="/ip-tracker" style={linkStyle}>
              <ShieldCheck size={18} />
              IP Filings Directory
            </NavLink>
          </>
        )}
      </div>

      {/* Exit / Sign Out Button in Sidebar */}
      <div
        style={{
          marginTop: "auto",
          padding: "16px 14px 4px 14px",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <button
          onClick={handleExit}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
            color: "#64748B",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FEF2F2";
            e.currentTarget.style.color = "#DC2626";
            e.currentTarget.style.borderColor = "#FCA5A5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F8FAFC";
            e.currentTarget.style.color = "#64748B";
            e.currentTarget.style.borderColor = "#E2E8F0";
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
