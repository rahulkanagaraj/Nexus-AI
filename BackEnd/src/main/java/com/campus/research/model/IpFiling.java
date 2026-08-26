package com.campus.research.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ip_filings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IpFiling {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false, unique = true)
    private Long projectId;

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

    public enum IpType {
        PATENT, COPYRIGHT, TRADE_SECRET, INDUSTRIAL_DESIGN
    }

    public enum FilingStatus {
        DRAFTED, FILED, UNDER_EXAMINATION, GRANTED, REJECTED
    }
}
