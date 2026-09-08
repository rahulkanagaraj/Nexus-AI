package com.campus.research.dto;

public class ReviewRequest {
    private Long projectId;
    private Long facultyId;
    private String statusChange;
    private String feedbackText;

    public ReviewRequest() {}

    public ReviewRequest(Long projectId, Long facultyId, String statusChange, String feedbackText) {
        this.projectId = projectId;
        this.facultyId = facultyId;
        this.statusChange = statusChange;
        this.feedbackText = feedbackText;
    }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }

    public String getStatusChange() { return statusChange; }
    public void setStatusChange(String statusChange) { this.statusChange = statusChange; }

    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
}
