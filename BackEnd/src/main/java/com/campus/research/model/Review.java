package com.campus.research.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    private String facultyName;

    @Column(nullable = false)
    private String statusChange;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String feedbackText;

    private LocalDateTime reviewedAt = LocalDateTime.now();

    public Review() {}

    public Review(Long id, Long projectId, Long facultyId, String facultyName, String statusChange, String feedbackText, LocalDateTime reviewedAt) {
        this.id = id;
        this.projectId = projectId;
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.statusChange = statusChange;
        this.feedbackText = feedbackText;
        this.reviewedAt = reviewedAt != null ? reviewedAt : LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getStatusChange() { return statusChange; }
    public void setStatusChange(String statusChange) { this.statusChange = statusChange; }

    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
