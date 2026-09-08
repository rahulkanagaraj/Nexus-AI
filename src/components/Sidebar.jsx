import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FilePlus, ShieldCheck, CheckSquare, BarChart3, Bookmark } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

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
        width: "240px",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        minHeight: "calc(100vh - 64px)",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ padding: "0 18px 12px 18px", fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
        {user.role} Navigation
      </div>

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
    </aside>
  );
}
