import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ShieldCheck, Plus, Award, FileText, Calendar, Edit3, CheckCircle } from "lucide-react";
import axios from "axios";

export default function IpFilingTracker() {
  const { user } = useAuth();
  const [ipFilings, setIpFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFiling, setEditingFiling] = useState(null);

  const fetchIpFilings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/ip-filings");
      setIpFilings(res.data);
    } catch (e) {
      console.error("Error fetching IP filings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpFilings();
  }, []);

  const handleUpdateIp = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/ip-filings/${editingFiling.id}`, editingFiling);
      setEditingFiling(null);
      fetchIpFilings();
    } catch (err) {
      alert("Failed to update IP filing record.");
    }
  };

  const getFilingStatusBadge = (status) => {
    const map = {
      DRAFTED: { bg: "#EFF6FF", color: "#2563EB", text: "Drafted" },
      FILED: { bg: "#FEF3C7", color: "#D97706", text: "Application Filed" },
      UNDER_EXAMINATION: { bg: "#F3E8FF", color: "#7C3AED", text: "Under Examination" },
      GRANTED: { bg: "#ECFDF5", color: "#059669", text: "Patent Granted 🎉" },
      REJECTED: { bg: "#FEF2F2", color: "#DC2626", text: "Application Rejected" },
    };
    const b = map[status] || map.DRAFTED;
    return (
      <span
        style={{
          backgroundColor: b.bg,
          color: b.color,
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {b.text}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px" }}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <ShieldCheck size={28} color="#2563EB" />
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0F172A" }}>
                Campus Intellectual Property (IP) &amp; Patent Filing Repository
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
              Centralized institutional tracker for research patents, copyrights, and application status lifecycle.
            </p>
          </div>

          {/* Metric Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total IP Filings</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>{ipFilings.length}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Patents Drafted</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563EB", marginTop: "4px" }}>
                {ipFilings.filter((i) => i.filing_status === "DRAFTED").length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Filed / Under Examination</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
                {ipFilings.filter((i) => i.filing_status === "FILED" || i.filing_status === "UNDER_EXAMINATION").length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Granted Patents</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>
                {ipFilings.filter((i) => i.filing_status === "GRANTED").length}
              </div>
            </div>
          </div>

          {/* Filings Table */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
              Institutional IP Record Catalog
            </h3>
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>Loading IP filings...</div>
            ) : ipFilings.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
                No projects currently marked ready for IP filing. Faculty can flag approved projects for IP filing in the Review Panel.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                    <th style={{ padding: "12px" }}>Project Title &amp; Student</th>
                    <th style={{ padding: "12px" }}>IP Type</th>
                    <th style={{ padding: "12px" }}>Application No.</th>
                    <th style={{ padding: "12px" }}>Inventors</th>
                    <th style={{ padding: "12px" }}>Filing Date</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ipFilings.map((ip) => (
                    <tr key={ip.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ fontWeight: 700, color: "#0F172A" }}>{ip.project_title}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>Author: {ip.student_name}</div>
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ fontWeight: 600, color: "#334155" }}>{ip.ip_type}</span>
                      </td>
                      <td style={{ padding: "14px 12px", fontFamily: "monospace", fontWeight: 600, color: "#2563EB" }}>
                        {ip.application_no || "N/A"}
                      </td>
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{ip.inventors || ip.student_name}</td>
                      <td style={{ padding: "14px 12px", color: "#64748B" }}>{ip.filing_date || "Pending"}</td>
                      <td style={{ padding: "14px 12px" }}>{getFilingStatusBadge(ip.filing_status)}</td>
                      <td style={{ padding: "14px 12px" }}>
                        <button
                          onClick={() => setEditingFiling(ip)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: "#EFF6FF",
                            color: "#2563EB",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <Edit3 size={14} /> Update IP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Edit IP Filing Modal */}
      {editingFiling && (
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
          <div style={{ width: "100%", maxWidth: "520px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>
              Update IP Application Details
            </h3>

            <form onSubmit={handleUpdateIp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  IP Category Type
                </label>
                <select
                  value={editingFiling.ip_type}
                  onChange={(e) => setEditingFiling({ ...editingFiling, ip_type: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                >
                  <option value="PATENT">Patent</option>
                  <option value="COPYRIGHT">Copyright</option>
                  <option value="TRADE_SECRET">Trade Secret</option>
                  <option value="INDUSTRIAL_DESIGN">Industrial Design</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Application Number
                </label>
                <input
                  type="text"
                  value={editingFiling.application_no}
                  onChange={(e) => setEditingFiling({ ...editingFiling, application_no: e.target.value })}
                  placeholder="e.g. IN202641098234"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Filing Status
                </label>
                <select
                  value={editingFiling.filing_status}
                  onChange={(e) => setEditingFiling({ ...editingFiling, filing_status: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                >
                  <option value="DRAFTED">Drafted</option>
                  <option value="FILED">Application Filed</option>
                  <option value="UNDER_EXAMINATION">Under Examination</option>
                  <option value="GRANTED">Patent Granted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Filing Date
                </label>
                <input
                  type="date"
                  value={editingFiling.filing_date || ""}
                  onChange={(e) => setEditingFiling({ ...editingFiling, filing_date: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Inventors &amp; Collaborators
                </label>
                <input
                  type="text"
                  value={editingFiling.inventors || ""}
                  onChange={(e) => setEditingFiling({ ...editingFiling, inventors: e.target.value })}
                  placeholder="e.g. Sarah Williams, Dr. Emily Carter"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingFiling(null)}
                  style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 18px", borderRadius: "8px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", fontWeight: 600 }}
                >
                  Save Record Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
