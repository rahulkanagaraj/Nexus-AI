import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle } from "lucide-react";
import axios from "axios";

export default function NewProjectModal({ isOpen, onClose, onProjectCreated, studentId, studentDepartment }) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Artificial Intelligence & Robotics");
  const [abstractText, setAbstractText] = useState("");
  const [facultyId, setFacultyId] = useState("3");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstractText", abstractText);
      formData.append("domain", domain);
      formData.append("department", studentDepartment || "Computer Science & Engineering");
      formData.append("studentId", studentId || 1);
      formData.append("facultyId", facultyId);
      if (file) {
        formData.append("proposalFile", file);
      }

      await axios.post("http://localhost:5000/api/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onProjectCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit research project proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} color="#60A5FA" />
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>Initiate New Campus Research Project</h3>
          </div>
          <button
            onClick={onClose}
            style={{ backgroundColor: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", color: "#991B1B", padding: "12px 24px", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Drone Swarm Navigation via Deep Reinforcement Learning"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Research Domain / Field
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="Artificial Intelligence & Robotics">Artificial Intelligence &amp; Robotics</option>
                <option value="Cybersecurity & Cryptography">Cybersecurity &amp; Cryptography</option>
                <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                <option value="Biomedical & Healthcare Tech">Biomedical &amp; Healthcare Tech</option>
                <option value="Renewable Energy & Embedded Systems">Renewable Energy &amp; Embedded Systems</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Assign Faculty Reviewer / Mentor
              </label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="3">Dr. Robert Vance (CSE Dept)</option>
                <option value="4">Dr. Emily Carter (AI & DS Dept)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
              Abstract / Project Objectives *
            </label>
            <textarea
              required
              rows={4}
              value={abstractText}
              onChange={(e) => setAbstractText(e.target.value)}
              placeholder="Provide a detailed summary of your research methodology, problem statement, and expected novel outcomes..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "13px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
              Upload Proposal Document (PDF Abstract)
            </label>
            <div
              style={{
                border: "2px dashed #CBD5E1",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#F8FAFC",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
                id="proposal-file-input"
              />
              <label htmlFor="proposal-file-input" style={{ cursor: "pointer" }}>
                <Upload size={24} color="#64748B" style={{ marginBottom: "6px" }} />
                <div style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>
                  {file ? file.name : "Click to choose PDF document"}
                </div>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>PDF, DOCX up to 10MB</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                color: "#475569",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              {submitting ? "Submitting Proposal..." : "Submit Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
