package com.campus.research.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ip_filings")
public class IpFiling {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    private String projectTitle;
    private String studentName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IpType ipType = IpType.PATENT;

    private String applicationNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FilingStatus filingStatus = FilingStatus.DRAFTED;

    private LocalDate filingDate;
    private String inventors;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum IpType {
        PATENT, COPYRIGHT, TRADE_SECRET, INDUSTRIAL_DESIGN
    }

    public enum FilingStatus {
        DRAFTED, FILED, UNDER_EXAMINATION, GRANTED, REJECTED
    }

    public IpFiling() {}

    public IpFiling(Long id, Long projectId, String projectTitle, String studentName, IpType ipType, String applicationNo, FilingStatus filingStatus, LocalDate filingDate, String inventors, String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.studentName = studentName;
        this.ipType = ipType != null ? ipType : IpType.PATENT;
        this.applicationNo = applicationNo;
        this.filingStatus = filingStatus != null ? filingStatus : FilingStatus.DRAFTED;
        this.filingDate = filingDate;
        this.inventors = inventors;
        this.notes = notes;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public IpType getIpType() { return ipType; }
    public void setIpType(IpType ipType) { this.ipType = ipType; }

    public String getApplicationNo() { return applicationNo; }
    public void setApplicationNo(String applicationNo) { this.applicationNo = applicationNo; }

    public FilingStatus getFilingStatus() { return filingStatus; }
    public void setFilingStatus(FilingStatus filingStatus) { this.filingStatus = filingStatus; }

    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }

    public String getInventors() { return inventors; }
    public void setInventors(String inventors) { this.inventors = inventors; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
