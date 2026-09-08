import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  ShieldCheck,
  Edit3,
  Search,
  Download,
  Filter,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";
import axios from "axios";

export default function IpFilingTracker() {
  const { user } = useAuth();
  const [ipFilings, setIpFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFiling, setEditingFiling] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchIpFilings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/ip-filings");
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
      const payload = {
        projectId: editingFiling.projectId || editingFiling.project_id,
        ipType: editingFiling.ipType || editingFiling.ip_type,
        applicationNo: editingFiling.applicationNo || editingFiling.application_no,
        filingStatus: editingFiling.filingStatus || editingFiling.filing_status,
        filingDate: editingFiling.filingDate || editingFiling.filing_date,
        inventors: editingFiling.inventors,
        notes: editingFiling.notes,
      };

      await axios.put(`/api/ip-filings/${editingFiling.id}`, payload);
      setEditingFiling(null);
      fetchIpFilings();
    } catch (err) {
      alert("Failed to update IP filing record: " + (err.response?.data?.message || err.message));
    }
  };

  const getFilingStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const map = {
      DRAFTED: { bg: "#EFF6FF", color: "#2563EB", text: "Drafted" },
      FILED: { bg: "#FEF3C7", color: "#D97706", text: "Application Filed" },
      UNDER_EXAMINATION: { bg: "#F3E8FF", color: "#7C3AED", text: "Under Examination" },
      GRANTED: { bg: "#ECFDF5", color: "#059669", text: "Patent Granted 🎉" },
      REJECTED: { bg: "#FEF2F2", color: "#DC2626", text: "Application Rejected" },
    };
    const b = map[s] || map.DRAFTED;
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

  const filteredFilings = ipFilings.filter((i) => {
    const title = (i.projectTitle || i.project_title || "").toLowerCase();
    const student = (i.studentName || i.student_name || "").toLowerCase();
    const appNo = (i.applicationNo || i.application_no || "").toLowerCase();
    const inventors = (i.inventors || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(query) || student.includes(query) || appNo.includes(query) || inventors.includes(query);

    const type = (i.ipType || i.ip_type || "").toUpperCase();
    const matchesType = selectedType === "ALL" || type === selectedType;

    const status = (i.filingStatus || i.filing_status || "").toUpperCase();
    const matchesStatus = selectedStatus === "ALL" || status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const exportCsv = () => {
    if (filteredFilings.length === 0) return;
    const headers = ["ID", "Project Title", "Student Author", "IP Type", "Application No", "Filing Status", "Filing Date", "Inventors", "Notes"];
    const rows = filteredFilings.map((f) => [
      f.id,
      `"${(f.projectTitle || f.project_title || "").replace(/"/g, '""')}"`,
      `"${(f.studentName || f.student_name || "").replace(/"/g, '""')}"`,
      f.ipType || f.ip_type || "",
      f.applicationNo || f.application_no || "",
      f.filingStatus || f.filing_status || "",
      f.filingDate || f.filing_date || "",
      `"${(f.inventors || "").replace(/"/g, '""')}"`,
      `"${(f.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `InnoFlow_IP_Filings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const draftedCount = ipFilings.filter((i) => (i.filingStatus || i.filing_status) === "DRAFTED").length;
  const filedCount = ipFilings.filter((i) => ["FILED", "UNDER_EXAMINATION"].includes(i.filingStatus || i.filing_status)).length;
  const grantedCount = ipFilings.filter((i) => (i.filingStatus || i.filing_status) === "GRANTED").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px", maxWidth: "1280px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <ShieldCheck size={28} color="#2563EB" />
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
                  Institutional IP &amp; Patent Collaborative Tracker
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
                Maintain a permanent repository of campus intellectual property, patent application numbers, and grant lifecycles.
              </p>
            </div>

            <button
              onClick={exportCsv}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 16px",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                color: "#1E293B",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Download size={16} /> Export IP Audit CSV
            </button>
          </div>

          {/* Metric KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Tracked Assets</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>{ipFilings.length}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>In Drafting Phase</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563EB", marginTop: "4px" }}>{draftedCount}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Under Official Examination</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>{filedCount}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Granted IP Rights</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>{grantedCount}</div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "11px" }} />
              <input
                type="text"
                placeholder="Search by title, inventor, or application #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>IP Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", backgroundColor: "#FFFFFF" }}
              >
                <option value="ALL">All Categories</option>
                <option value="PATENT">Patent</option>
                <option value="COPYRIGHT">Copyright</option>
                <option value="TRADE_SECRET">Trade Secret</option>
                <option value="INDUSTRIAL_DESIGN">Industrial Design</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", backgroundColor: "#FFFFFF" }}
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFTED">Drafted</option>
                <option value="FILED">Application Filed</option>
                <option value="UNDER_EXAMINATION">Under Examination</option>
                <option value="GRANTED">Patent Granted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading IP filings repository...</div>
            ) : filteredFilings.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "#64748B" }}>
                <ShieldCheck size={36} color="#CBD5E1" style={{ margin: "0 auto 12px auto" }} />
                <h4 style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "15px" }}>No IP Filings Matched</h4>
                <p style={{ margin: 0, fontSize: "13px" }}>
                  Research proposals endorsed as "Ready for IP" automatically show up here.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Project Title &amp; Lead Researcher</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>IP Category</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Application No.</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Inventors &amp; Collaborators</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Filing Date</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Status</th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFilings.map((ip) => {
                      const title = ip.projectTitle || ip.project_title;
                      const student = ip.studentName || ip.student_name;
                      const appNo = ip.applicationNo || ip.application_no;
                      const ipType = ip.ipType || ip.ip_type;
                      const status = ip.filingStatus || ip.filing_status;
                      const date = ip.filingDate || ip.filing_date;

                      return (
                        <tr key={ip.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: 700, color: "#0F172A", maxWidth: "320px" }}>{title}</div>
                            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>Author: {student}</div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: "4px",
                                backgroundColor: "#F1F5F9",
                                color: "#334155",
                              }}
                            >
                              {ipType}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700, color: "#2563EB" }}>
                            {appNo || "PENDING"}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#475569", maxWidth: "220px" }}>
                            {ip.inventors || student}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#64748B" }}>
                            {date || "In Drafting"}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {getFilingStatusBadge(status)}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <button
                              onClick={() => setEditingFiling(ip)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#EFF6FF",
                                color: "#2563EB",
                                border: "1px solid #BFDBFE",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <Edit3 size={14} /> Manage IP
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit IP Modal */}
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
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: "26px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={20} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>
                  Manage Institutional IP Record
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>
                  {editingFiling.projectTitle || editingFiling.project_title}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateIp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    IP Category
                  </label>
                  <select
                    value={editingFiling.ipType || editingFiling.ip_type || "PATENT"}
                    onChange={(e) =>
                      setEditingFiling({
                        ...editingFiling,
                        ipType: e.target.value,
                        ip_type: e.target.value,
                      })
                    }
                    style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="PATENT">Patent</option>
                    <option value="COPYRIGHT">Copyright</option>
                    <option value="TRADE_SECRET">Trade Secret</option>
                    <option value="INDUSTRIAL_DESIGN">Industrial Design</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Lifecycle Status
                  </label>
                  <select
                    value={editingFiling.filingStatus || editingFiling.filing_status || "DRAFTED"}
                    onChange={(e) =>
                      setEditingFiling({
                        ...editingFiling,
                        filingStatus: e.target.value,
                        filing_status: e.target.value,
                      })
                    }
                    style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="DRAFTED">Drafted</option>
                    <option value="FILED">Application Filed</option>
                    <option value="UNDER_EXAMINATION">Under Examination</option>
                    <option value="GRANTED">Patent Granted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Application Number
                </label>
                <input
                  type="text"
                  value={editingFiling.applicationNo || editingFiling.application_no || ""}
                  onChange={(e) =>
                    setEditingFiling({
                      ...editingFiling,
                      applicationNo: e.target.value,
                      application_no: e.target.value,
                    })
                  }
                  placeholder="e.g. IN202641098234"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Filing Date
                </label>
                <input
                  type="date"
                  value={editingFiling.filingDate || editingFiling.filing_date || ""}
                  onChange={(e) =>
                    setEditingFiling({
                      ...editingFiling,
                      filingDate: e.target.value,
                      filing_date: e.target.value,
                    })
                  }
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
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
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Institutional IP Cell Notes &amp; Examination Log
                </label>
                <textarea
                  rows={3}
                  value={editingFiling.notes || ""}
                  onChange={(e) => setEditingFiling({ ...editingFiling, notes: e.target.value })}
                  placeholder="Notes on novelty check, prior art search, or examiner queries..."
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingFiling(null)}
                  style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 20px", borderRadius: "8px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Save IP Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
