import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, School, User, Building } from "lucide-react";
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
        // Sign Up Mode
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          fullName,
          email,
          password,
          role,
          department,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "FACULTY" || user.role === "ADMIN") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        // Sign In Mode
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
          role,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "FACULTY" || user.role === "ADMIN") {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
          padding: "26px 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#2563eb",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px auto",
            }}
          >
            <School size={22} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
            Campus Research Portal
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            {isSignUp ? "Create a new account" : "Sign in to access your dashboard"}
          </p>
        </div>

        {/* Role Segment Toggle */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            padding: "3px",
            marginBottom: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              borderRadius: "6px",
              backgroundColor: role === "STUDENT" ? "#ffffff" : "transparent",
              color: role === "STUDENT" ? "#2563eb" : "#64748b",
              boxShadow: role === "STUDENT" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("FACULTY")}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              borderRadius: "6px",
              backgroundColor: role === "FACULTY" ? "#ffffff" : "transparent",
              color: role === "FACULTY" ? "#2563eb" : "#64748b",
              boxShadow: role === "FACULTY" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            Faculty Reviewer
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "9px" }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
              Email / Roll Number
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "9px" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "STUDENT" ? "alex.student@campus.edu" : "robert.faculty@campus.edu"}
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 32px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "9px" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 32px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                Department
              </label>
              <div style={{ position: "relative" }}>
                <Building size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "9px" }} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <option value="Computer Science & Engineering">Computer Science &amp; Engg</option>
                  <option value="AI & Data Science">AI &amp; Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
              padding: "9px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "13px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : `Sign In as ${role === "STUDENT" ? "Student" : "Faculty"}`}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up Link */}
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}