package com.campus.research.dto;

public class IpFilingRequest {
    private Long projectId;
    private String ipType;
    private String applicationNo;
    private String filingStatus;
    private String filingDate;
    private String inventors;
    private String notes;

    public IpFilingRequest() {}

    public IpFilingRequest(Long projectId, String ipType, String applicationNo, String filingStatus, String filingDate, String inventors, String notes) {
        this.projectId = projectId;
        this.ipType = ipType;
        this.applicationNo = applicationNo;
        this.filingStatus = filingStatus;
        this.filingDate = filingDate;
        this.inventors = inventors;
        this.notes = notes;
    }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getIpType() { return ipType; }
    public void setIpType(String ipType) { this.ipType = ipType; }

    public String getApplicationNo() { return applicationNo; }
    public void setApplicationNo(String applicationNo) { this.applicationNo = applicationNo; }

    public String getFilingStatus() { return filingStatus; }
    public void setFilingStatus(String filingStatus) { this.filingStatus = filingStatus; }

    public String getFilingDate() { return filingDate; }
    public void setFilingDate(String filingDate) { this.filingDate = filingDate; }

    public String getInventors() { return inventors; }
    public void setInventors(String inventors) { this.inventors = inventors; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
