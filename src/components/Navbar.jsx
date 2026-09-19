import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "64px",
        backgroundColor: "#0F172A",
        borderBottom: "1px solid #1E293B",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Nexus-AI Heading */}
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
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)",
            }}
          >
            <Layers size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
                Nexus-AI
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

        {/* Fetched User Name & Avatar */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 12px",
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
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>
                {user.name}
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8", lineHeight: 1 }}>
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
