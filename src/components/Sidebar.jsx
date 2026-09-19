import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SidebarItem({ to, iconClass }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <NavLink
        to={to}
        style={({ isActive }) => ({
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isActive ? "#4B5D8C" : "#64748B",
          backgroundColor: isActive ? "#E8EDF7" : "transparent",
          border: isActive ? "1px solid #D9E2EC" : "1px solid transparent",
          textDecoration: "none",
          transition: "all 0.2s ease",
          boxShadow: isActive ? "0 2px 8px rgba(75, 93, 140, 0.15)" : "none",
        })}
      >
        <i className={iconClass} style={{ fontSize: "1.25rem" }}></i>
      </NavLink>
    </div>
  );
}

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

  return (
    <aside
      style={{
        width: "68px",
        minWidth: "68px",
        maxWidth: "68px",
        flexShrink: 0,
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #D9E2EC",
        padding: "24px 0 16px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        zIndex: 90,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Navigation Icons Container centered vertically */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {isStudent && (
          <>
            <SidebarItem
              to="/student/dashboard"
              iconClass="bi bi-grid-1x2-fill"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
            />
          </>
        )}

        {isFaculty && (
          <>
            <SidebarItem
              to="/faculty/dashboard"
              iconClass="bi bi-check2-square"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
            />
          </>
        )}

        {isIpCell && (
          <>
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
            />
            <SidebarItem
              to="/faculty/dashboard"
              iconClass="bi bi-journal-text"
            />
          </>
        )}

        {isAdmin && (
          <>
            <SidebarItem
              to="/faculty/dashboard"
              iconClass="bi bi-sliders"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
            />
          </>
        )}
      </div>

      {/* Sign Out Icon Button at Bottom */}
      <div
        style={{
          marginTop: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "16px",
          borderTop: "1px solid #D9E2EC",
        }}
      >
        <button
          onClick={handleExit}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            border: "1px solid #D9E2EC",
            backgroundColor: "#F8FAFC",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            e.currentTarget.style.borderColor = "#D9E2EC";
          }}
        >
          <i className="bi bi-box-arrow-right" style={{ fontSize: "1.25rem" }}></i>
        </button>
      </div>
    </aside>
  );
}
