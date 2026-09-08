import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, School, User, Building, Layers, Award, Sparkles, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const response = await axios.post("/api/auth/register", {
          fullName,
          email,
          password,
          role,
          department,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "IP_CELL") {
          navigate("/ip-tracker");
        } else if (user.role === "FACULTY" || user.role === "ADMIN") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        const response = await axios.post("/api/auth/login", {
          email,
          password,
          role,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "IP_CELL") {
          navigate("/ip-tracker");
        } else if (user.role === "FACULTY" || user.role === "ADMIN") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || (isSignUp ? "Registration failed." : "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (userType) => {
    if (userType === "student") {
      setEmail("alex.student@campus.edu");
      setPassword("student123");
      setRole("STUDENT");
    } else if (userType === "faculty") {
      setEmail("robert.faculty@campus.edu");
      setPassword("faculty123");
      setRole("FACULTY");
    } else if (userType === "ipcell") {
      setEmail("ipcell@campus.edu");
      setPassword("admin123");
      setRole("IP_CELL");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1E293B 0%, #0F172A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          padding: "32px 28px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
              boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)",
            }}
          >
            <Layers size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            InnoFlow Platform
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            {isSignUp ? "Register a new campus researcher profile" : "Academic Research & IP Filing Lifecycle"}
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
            <Sparkles size={13} color="#6366F1" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
              Quick Demo Fill
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => fillQuickLogin("student")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#EFF6FF",
                color: "#2563EB",
                border: "1px solid #BFDBFE",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("faculty")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              👨‍🏫 Mentor
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("ipcell")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#F5F3FF",
                color: "#7C3AED",
                border: "1px solid #DDD6FE",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🏛️ IP Cell
            </button>
          </div>
        </div>

        {/* Role Segment Toggle for Sign Up */}
        {isSignUp && (
          <div
            style={{
              display: "flex",
              backgroundColor: "#F1F5F9",
              borderRadius: "8px",
              padding: "3px",
              marginBottom: "16px",
            }}
          >
            {["STUDENT", "FACULTY", "IP_CELL"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: role === r ? "#FFFFFF" : "transparent",
                  color: role === r ? "#2563EB" : "#64748B",
                  boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                }}
              >
                {r === "IP_CELL" ? "IP Cell" : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  style={{
                    width: "100%",
                    padding: "9px 10px 9px 34px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
              Campus Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                style={{
                  width: "100%",
                  padding: "9px 10px 9px 34px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "9px 10px 9px 34px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                Department
              </label>
              <div style={{ position: "relative" }}>
                <Building size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 10px 9px 34px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                  <option value="AI & Data Science">AI &amp; Data Science</option>
                  <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                  <option value="Biotechnology & Bioengineering">Biotechnology &amp; Bioengineering</option>
                  <option value="Institutional IP Cell & Tech Transfer">Institutional IP Cell &amp; Tech Transfer</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
              marginTop: "6px",
            }}
          >
            {loading ? "Authenticating..." : isSignUp ? "Create InnoFlow Account" : "Access Portal"}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#64748B" }}>
          {isSignUp ? "Already registered on InnoFlow? " : "New researcher or student? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontSize: "12px",
            }}
          >
            {isSignUp ? "Sign In" : "Register Here"}
          </button>
        </div>
      </div>
    </div>
  );
}