import React from "react";
import { CheckCircle2, Clock, FileText, AlertCircle, Award, ShieldCheck } from "lucide-react";

export default function MilestoneTimeline({ status }) {
  const steps = [
    { id: "SUBMITTED", label: "Proposal Submitted", icon: FileText },
    { id: "UNDER_REVIEW", label: "Under Faculty Review", icon: Clock },
    { id: "APPROVED", label: "Faculty Approved", icon: CheckCircle2 },
    { id: "READY_FOR_IP", label: "Ready for IP Filing", icon: ShieldCheck },
    { id: "IP_FILED", label: "IP Patent Filed", icon: Award },
  ];

  const getStepState = (stepId) => {
    if (status === "REJECTED") {
      if (stepId === "SUBMITTED") return "completed";
      if (stepId === "UNDER_REVIEW") return "rejected";
      return "pending";
    }

    if (status === "REVISION_REQUESTED") {
      if (stepId === "SUBMITTED") return "completed";
      if (stepId === "UNDER_REVIEW") return "warning";
      return "pending";
    }

    const order = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "READY_FOR_IP", "IP_FILED"];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        {steps.map((step, idx) => {
          const state = getStepState(step.id);
          const Icon = step.icon;

          let bgColor = "#E2E8F0";
          let textColor = "#64748B";
          let borderColor = "#CBD5E1";

          if (state === "completed") {
            bgColor = "#10B981";
            textColor = "#FFFFFF";
            borderColor = "#059669";
          } else if (state === "active") {
            bgColor = "#2563EB";
            textColor = "#FFFFFF";
            borderColor = "#1D4ED8";
          } else if (state === "warning") {
            bgColor = "#F59E0B";
            textColor = "#FFFFFF";
            borderColor = "#D97706";
          } else if (state === "rejected") {
            bgColor = "#EF4444";
            textColor = "#FFFFFF";
            borderColor = "#DC2626";
          }

          return (
            <React.Fragment key={step.id}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: bgColor,
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    border: `3px solid ${borderColor}`,
                    boxShadow: state === "active" ? "0 0 12px rgba(37, 99, 235, 0.4)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={20} />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: state === "active" || state === "completed" ? "600" : "400",
                    color: state === "active" ? "#1E293B" : "#64748B",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "4px",
                    backgroundColor: idx < steps.findIndex((s) => s.id === status) ? "#10B981" : "#E2E8F0",
                    margin: "0 -10px",
                    marginBottom: "24px",
                    zIndex: 1,
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
