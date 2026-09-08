import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import { Search, Filter, Download, CheckCircle, AlertTriangle, ShieldCheck, XCircle } from "lucide-react";
import axios from "axios";

export default function FacultyReviewPanel() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsLog, setReviewsLog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchFacultyProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects?role=FACULTY&userId=${user.id}`);
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (e) {
      console.error("Error loading faculty evaluation list:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectReviews = async (projectId) => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/reviews`);
      setReviewsLog(res.data);
    } catch (e) {
      console.error("Error fetching reviews log:", e);
    }
  };

  useEffect(() => {
    if (user) fetchFacultyProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectReviews(selectedProject.id);
    }
  }, [selectedProject]);

  const handleReviewAction = async (statusChange) => {
    if (!feedbackText && statusChange === "REVISION_REQUESTED") {
      alert("Please provide feedback notes detailing required revisions.");
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post("/api/reviews", {
        projectId: selectedProject.id,
        facultyId: user.id,
        statusChange,
        feedbackText: feedbackText || `Project status updated to ${statusChange}`,
      });

      setFeedbackText("");
      await fetchFacultyProjects();
      if (selectedProject) {
        setSelectedProject({ ...selectedProject, status: statusChange });
        fetchProjectReviews(selectedProject.id);
      }
    } catch (e) {
      alert("Failed to record review decision.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.student_name && p.student_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px", minWidth: 0 }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: 800, color: "#0F172A" }}>
              Faculty Proposal Review &amp; Evaluation Panel
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
              Consolidated evaluation console to review student proposals, provide feedback, and flag projects for Intellectual Property (IP) filings.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by proposal title or student name..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={18} color="#64748B" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="REVISION_REQUESTED">Revision Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="READY_FOR_IP">Ready for IP Filing</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                Pending Proposals ({filteredProjects.length})
              </h3>
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>Loading proposals...</div>
              ) : filteredProjects.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                  No research proposals matching criteria.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      style={{
                        padding: "16px",
                        borderRadius: "10px",
                        border: selectedProject?.id === p.id ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selectedProject?.id === p.id ? "#EFF6FF" : "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#2563EB" }}>
                          Student: {p.studentName || p.student_name || "Student Researcher"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>{p.department}</span>
                      </div>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                        {p.title}
                      </h4>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>Status: {p.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px" }}>
              {selectedProject ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#2563EB" }}>
                        {selectedProject.domain}
                      </span>
                      <h3 style={{ margin: "4px 0 2px 0", fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>
                        {selectedProject.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        Submitted by: <strong>{selectedProject.studentName || selectedProject.student_name}</strong> ({selectedProject.department})
                      </span>
                    </div>
                  </div>

                  <MilestoneTimeline status={selectedProject.status} />

                  <div style={{ backgroundColor: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Abstract &amp; Novelty Claims
                    </h4>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                      {selectedProject.abstractText || selectedProject.abstract_text}
                    </p>
                    <a
                      href={(() => {
                        const url = selectedProject.fileUrl || selectedProject.file_url || "/uploads/default_abstract.pdf";
                        return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || ""}${url}`;
                      })()}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#2563EB", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                    >
                      <Download size={15} /> View Full PDF Proposal
                    </a>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                      Input Constructive Evaluation Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Specify revision requirements or recommendations for patent/copyright filing..."
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                    <button
                      onClick={() => handleReviewAction("APPROVED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#059669",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <CheckCircle size={16} /> Approve Proposal
                    </button>

                    <button
                      onClick={() => handleReviewAction("READY_FOR_IP")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#2563EB",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <ShieldCheck size={16} /> Mark Ready for IP Filing
                    </button>

                    <button
                      onClick={() => handleReviewAction("REVISION_REQUESTED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#D97706",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <AlertTriangle size={16} /> Request Revisions
                    </button>

                    <button
                      onClick={() => handleReviewAction("REJECTED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#DC2626",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <XCircle size={16} /> Reject Proposal
                    </button>
                  </div>

                  {reviewsLog.length > 0 && (
                    <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                        Evaluation History &amp; Feedback Logs
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {reviewsLog.map((rev) => (
                          <div key={rev.id} style={{ backgroundColor: "#F8FAFC", padding: "10px 12px", borderRadius: "6px", fontSize: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", marginBottom: "4px" }}>
                              <strong>{rev.faculty_name}</strong>
                              <span>{new Date(rev.reviewed_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ color: "#1E293B" }}>{rev.feedback_text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                  Select a proposal from the left list to review document and enter feedback decision.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
