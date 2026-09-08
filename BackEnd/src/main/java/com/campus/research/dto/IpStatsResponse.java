package com.campus.research.dto;

public class IpStatsResponse {
    private long totalFilings;
    private long granted;
    private long underExamination;
    private long filed;
    private long drafted;

    public IpStatsResponse() {}

    public IpStatsResponse(long totalFilings, long granted, long underExamination, long filed, long drafted) {
        this.totalFilings = totalFilings;
        this.granted = granted;
        this.underExamination = underExamination;
        this.filed = filed;
        this.drafted = drafted;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalFilings;
        private long granted;
        private long underExamination;
        private long filed;
        private long drafted;

        public Builder totalFilings(long totalFilings) { this.totalFilings = totalFilings; return this; }
        public Builder granted(long granted) { this.granted = granted; return this; }
        public Builder underExamination(long underExamination) { this.underExamination = underExamination; return this; }
        public Builder filed(long filed) { this.filed = filed; return this; }
        public Builder drafted(long drafted) { this.drafted = drafted; return this; }

        public IpStatsResponse build() {
            return new IpStatsResponse(totalFilings, granted, underExamination, filed, drafted);
        }
    }

    public long getTotalFilings() { return totalFilings; }
    public void setTotalFilings(long totalFilings) { this.totalFilings = totalFilings; }

    public long getGranted() { return granted; }
    public void setGranted(long granted) { this.granted = granted; }

    public long getUnderExamination() { return underExamination; }
    public void setUnderExamination(long underExamination) { this.underExamination = underExamination; }

    public long getFiled() { return filed; }
    public void setFiled(long filed) { this.filed = filed; }

    public long getDrafted() { return drafted; }
    public void setDrafted(long drafted) { this.drafted = drafted; }
}
