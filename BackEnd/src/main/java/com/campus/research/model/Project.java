package com.campus.research.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String abstractText;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SUBMITTED;

    private String currentMilestone = "Proposal Submitted";

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "faculty_id")
    private Long facultyId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        SUBMITTED, UNDER_REVIEW, REVISION_REQUESTED, APPROVED, READY_FOR_IP, IP_FILED, REJECTED
    }
}
