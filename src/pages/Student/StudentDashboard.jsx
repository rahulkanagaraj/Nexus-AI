import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import NewProjectModal from "./NewProjectModal";
import { Plus, FileText, Download, Clock, CheckCircle2, AlertCircle, ShieldCheck, MessageSquare } from "lucide-react";
import axios from "axios";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchStudentProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects?role=STUDENT&userId=${user.id}`);
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectReviews = async (projectId) => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/reviews`);
      setReviews(res.data);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    }
  };

  useEffect(() => {
    if (user) fetchStudentProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject?.id) {
      fetchProjectReviews(selectedProject.id);
    }
  }, [selectedProject]);

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const badges = {
      SUBMITTED: { bg: "#EFF6FF", color: "#2563EB", text: "Submitted" },
      UNDER_REVIEW: { bg: "#FEF3C7", color: "#D97706", text: "Under Faculty Review" },
      REVISION_REQUESTED: { bg: "#FFF7ED", color: "#C2410C", text: "Revision Required" },
      APPROVED: { bg: "#ECFDF5", color: "#059669", text: "Approved" },
      READY_FOR_IP: { bg: "#F0FDF4", color: "#166534", text: "Ready for IP Filing" },
      IP_FILED: { bg: "#F0F9FF", color: "#0369A1", text: "Patent Filed" },
      REJECTED: { bg: "#FEF2F2", color: "#DC2626", text: "Rejected" },
    };
    const b = badges[s] || badges.SUBMITTED;
    return (
      <span
        style={{
          backgroundColor: b.bg,
          color: b.color,
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {b.text}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px", maxWidth: "1280px", minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
                Student Researcher Workspace
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
                Submit research proposals, track visual evaluation milestones, and monitor IP patent progression.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
              }}
            >
              <Plus size={18} />
              Submit Proposal
            </button>
          </div>

          {/* Metrics summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Proposals</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>{projects.length}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Under Review</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
                {projects.filter((p) => ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUESTED"].includes(p.status)).length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Approved Proposals</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>
                {projects.filter((p) => ["APPROVED", "READY_FOR_IP", "IP_FILED"].includes(p.status)).length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>IP Eligible / Filed</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#2563EB", marginTop: "4px" }}>
                {projects.filter((p) => ["READY_FOR_IP", "IP_FILED"].includes(p.status)).length}
              </div>
            </div>
          </div>

          {/* Projects Table & Detailed Card */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr", gap: "24px" }}>
            {/* Project List */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                My Research Initiatives ({projects.length})
              </h3>
              {loading ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>Loading research proposals...</div>
              ) : projects.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748B" }}>
                  No research projects submitted yet. Click "Submit Proposal" above to start.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {projects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id;
                    const abstract = proj.abstractText || proj.abstract_text;
                    const mentor = proj.facultyName || proj.faculty_name || "Assigned Mentor";

                    return (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        style={{
                          padding: "16px",
                          borderRadius: "10px",
                          border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                          backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0F172A", flex: 1, paddingRight: "10px" }}>
                            {proj.title}
                          </h4>
                          {getStatusBadge(proj.status)}
                        </div>
                        <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#64748B", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                          {abstract}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8" }}>
                          <span>Domain: {proj.domain}</span>
                          <span>Mentor: {mentor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Project Milestone & Details Panel */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px" }}>
              {selectedProject ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>
                        {selectedProject.domain}
                      </span>
                      <h3 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>
                        {selectedProject.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        Current Milestone: <strong>{selectedProject.currentMilestone || "Proposal Evaluation"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual Milestone Stepper */}
                  <div style={{ marginTop: "16px", marginBottom: "20px" }}>
                    <MilestoneTimeline status={selectedProject.status} />
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Abstract Summary
                    </h4>
                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                      {selectedProject.abstractText || selectedProject.abstract_text}
                    </p>

                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Proposal Documents &amp; Attachments
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={18} color="#2563EB" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>
                          {selectedProject.fileName || selectedProject.file_name || "Proposal_Abstract.pdf"}
                        </span>
                      </div>
                      <a
                        href={(() => {
                          const url = selectedProject.fileUrl || selectedProject.file_url || "/uploads/default_abstract.pdf";
                          return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || ""}${url}`;
                        })()}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563EB", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                      >
                        <Download size={14} /> Download File
                      </a>
                    </div>

                    {/* Centralized Faculty Feedback Log */}
                    <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <MessageSquare size={16} color="#2563EB" />
                        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                          Mentor Feedback &amp; Review History
                        </h4>
                      </div>

                      {reviews.length === 0 ? (
                        <div style={{ padding: "12px", backgroundColor: "#F8FAFC", borderRadius: "8px", fontSize: "12px", color: "#64748B", textAlign: "center" }}>
                          No mentor evaluations submitted yet. Your assigned faculty reviewer will provide feedback shortly.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {reviews.map((rev) => (
                            <div
                              key={rev.id}
                              style={{
                                padding: "12px",
                                backgroundColor: "#F8FAFC",
                                borderRadius: "8px",
                                borderLeft: `3px solid ${rev.statusChange === "APPROVED" || rev.statusChange === "READY_FOR_IP" ? "#059669" : "#D97706"}`,
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>
                                  {rev.facultyName || rev.faculty_name || "Faculty Mentor"}
                                </span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: rev.statusChange === "APPROVED" ? "#059669" : "#2563EB" }}>
                                  {rev.statusChange}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: "12px", color: "#334155", lineHeight: 1.4 }}>
                                "{rev.feedbackText || rev.feedback_text}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "60px 20px", textAlign: "center", color: "#94A3B8" }}>
                  Select a research initiative from the list to view its milestone timeline, documents, and mentor feedback.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchStudentProjects}
        studentId={user.id}
        studentDepartment={user.department}
      />
    </div>
  );
}
