import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import NewProjectModal from "./NewProjectModal";
import { Plus, FileText, Download } from "lucide-react";
import axios from "axios";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchStudentProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/projects?role=STUDENT&userId=${user.id}`);
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

  useEffect(() => {
    if (user) fetchStudentProjects();
  }, [user]);

  const getStatusBadge = (status) => {
    const badges = {
      SUBMITTED: { bg: "#EFF6FF", color: "#2563EB", text: "Submitted" },
      UNDER_REVIEW: { bg: "#FEF3C7", color: "#D97706", text: "Under Faculty Review" },
      REVISION_REQUESTED: { bg: "#FFF7ED", color: "#C2410C", text: "Revision Required" },
      APPROVED: { bg: "#ECFDF5", color: "#059669", text: "Approved" },
      READY_FOR_IP: { bg: "#F0FDF4", color: "#166534", text: "Ready for IP Filing" },
      IP_FILED: { bg: "#F0F9FF", color: "#0369A1", text: "Patent Filed" },
      REJECTED: { bg: "#FEF2F2", color: "#DC2626", text: "Rejected" },
    };
    const b = badges[status] || badges.SUBMITTED;
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
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: 800, color: "#0F172A" }}>
                Student Research Dashboard
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
                Manage campus research proposals, track review milestones, and monitor IP filing eligibility.
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Projects</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>{projects.length}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Under Review</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
                {projects.filter((p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW").length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Approved</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>
                {projects.filter((p) => p.status === "APPROVED" || p.status === "READY_FOR_IP" || p.status === "IP_FILED").length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>IP Eligible / Filed</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563EB", marginTop: "4px" }}>
                {projects.filter((p) => p.status === "READY_FOR_IP" || p.status === "IP_FILED").length}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                My Research Initiatives
              </h3>
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>Loading projects...</div>
              ) : projects.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                  No research projects submitted yet. Click "Submit Proposal" to initiate a project.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      style={{
                        padding: "16px",
                        borderRadius: "10px",
                        border: selectedProject?.id === proj.id ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selectedProject?.id === proj.id ? "#EFF6FF" : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A", flex: 1, paddingRight: "10px" }}>
                          {proj.title}
                        </h4>
                        {getStatusBadge(proj.status)}
                      </div>
                      <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#64748B", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {proj.abstract_text}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8" }}>
                        <span>Domain: {proj.domain}</span>
                        <span>Mentor: {proj.faculty_name || "Unassigned"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
              {selectedProject ? (
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                    Lifecycle Milestone Progress
                  </h3>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Project ID #{selectedProject.id}</span>

                  <div style={{ marginTop: "20px", marginBottom: "24px" }}>
                    <MilestoneTimeline status={selectedProject.status} />
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Abstract Summary
                    </h4>
                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                      {selectedProject.abstract_text}
                    </p>

                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                      Submitted Documentation
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={18} color="#2563EB" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>
                          {selectedProject.file_name || "Proposal_Abstract.pdf"}
                        </span>
                      </div>
                      <a
                        href={`http://localhost:5000${selectedProject.file_url || "/uploads/default_abstract.pdf"}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563EB", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                      >
                        <Download size={14} /> View Document
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                  Select a project from the left to view milestone timeline and details.
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
