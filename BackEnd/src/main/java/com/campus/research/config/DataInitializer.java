package com.campus.research.config;

import com.campus.research.model.*;
import com.campus.research.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalDocumentRepository proposalDocumentRepository;
    private final MilestoneRepository milestoneRepository;
    private final ReviewRepository reviewRepository;
    private final IpFilingRepository ipFilingRepository;

    public DataInitializer(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ProposalDocumentRepository proposalDocumentRepository,
            MilestoneRepository milestoneRepository,
            ReviewRepository reviewRepository,
            IpFilingRepository ipFilingRepository
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.proposalDocumentRepository = proposalDocumentRepository;
        this.milestoneRepository = milestoneRepository;
        this.reviewRepository = reviewRepository;
        this.ipFilingRepository = ipFilingRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            // Ensure IP Cell officer exists even if DB was already seeded with older accounts
            if (userRepository.findByEmailIgnoreCase("ipcell@campus.edu").isEmpty()) {
                userRepository.save(new User(null, "Institutional IP Cell Officer", "ipcell@campus.edu", "admin123", User.Role.IP_CELL, "Institutional IP Cell & Tech Transfer", LocalDateTime.now()));
            }
            return; // Core users already initialized
        }

        System.out.println("Initializing Nexus-AI Seed Data for Academic Research & IP Management...");

        // 1. Seed Users
        User u1 = new User(null, "Alex Johnson", "alex.student@campus.edu", "student123", User.Role.STUDENT, "Computer Science & Engineering", LocalDateTime.now());
        User u2 = new User(null, "Sarah Williams", "sarah.student@campus.edu", "student123", User.Role.STUDENT, "AI & Data Science", LocalDateTime.now());
        User u3 = new User(null, "Dr. Robert Vance", "robert.faculty@campus.edu", "faculty123", User.Role.FACULTY, "Computer Science & Engineering", LocalDateTime.now());
        User u4 = new User(null, "Dr. Emily Carter", "emily.faculty@campus.edu", "faculty123", User.Role.FACULTY, "AI & Data Science", LocalDateTime.now());
        User u5 = new User(null, "Institutional IP Cell Officer", "ipcell@campus.edu", "admin123", User.Role.IP_CELL, "Institutional IP Cell & Tech Transfer", LocalDateTime.now());
        User u6 = new User(null, "Platform Administrator", "admin@campus.edu", "admin123", User.Role.ADMIN, "Research & Development", LocalDateTime.now());

        userRepository.saveAll(List.of(u1, u2, u3, u4, u5, u6));

        // 2. Seed Projects
        Project p1 = new Project();
        p1.setTitle("Autonomous Drone Swarm Navigation via Deep Reinforcement Learning");
        p1.setAbstractText("This project proposes a decentralized deep reinforcement learning algorithm for real-time trajectory optimization in multi-agent drone swarms under GPS-denied environments.");
        p1.setDepartment("Computer Science & Engineering");
        p1.setDomain("Artificial Intelligence & Robotics");
        p1.setStatus(Project.Status.UNDER_REVIEW);
        p1.setCurrentMilestone("Faculty Evaluation");
        p1.setStudentId(u1.getId());
        p1.setStudentName(u1.getFullName());
        p1.setFacultyId(u3.getId());
        p1.setFacultyName(u3.getFullName());
        p1.setFileName("Drone_Swarm_Navigation_Proposal.pdf");
        p1.setFileUrl("/uploads/sample_drone_proposal.pdf");
        p1.setCreatedAt(LocalDateTime.now().minusDays(10));
        p1.setUpdatedAt(LocalDateTime.now().minusDays(2));

        Project p2 = new Project();
        p2.setTitle("Blockchain-Based Secure Medical Record Vault with Zero-Knowledge Proofs");
        p2.setAbstractText("A privacy-preserving electronic health records sharing platform leveraging ZK-SNARKs and IPFS for decentralized encryption and HIPAA compliance.");
        p2.setDepartment("AI & Data Science");
        p2.setDomain("Cybersecurity & Cryptography");
        p2.setStatus(Project.Status.READY_FOR_IP);
        p2.setCurrentMilestone("Ready for IP Filing");
        p2.setStudentId(u2.getId());
        p2.setStudentName(u2.getFullName());
        p2.setFacultyId(u4.getId());
        p2.setFacultyName(u4.getFullName());
        p2.setFileName("Medical_Vault_ZKProofs_Proposal.pdf");
        p2.setFileUrl("/uploads/sample_medical_proposal.pdf");
        p2.setCreatedAt(LocalDateTime.now().minusDays(15));
        p2.setUpdatedAt(LocalDateTime.now().minusDays(1));

        Project p3 = new Project();
        p3.setTitle("Low-Power IoT Edge Sensor Nodes for Agricultural Soil Health Monitoring");
        p3.setAbstractText("Designing an ultra-low energy LoRaWAN sensor node array capable of harvesting solar energy and predicting crop yield through machine learning.");
        p3.setDepartment("Computer Science & Engineering");
        p3.setDomain("Internet of Things (IoT)");
        p3.setStatus(Project.Status.APPROVED);
        p3.setCurrentMilestone("Proposal Approved");
        p3.setStudentId(u1.getId());
        p3.setStudentName(u1.getFullName());
        p3.setFacultyId(u3.getId());
        p3.setFacultyName(u3.getFullName());
        p3.setFileName("IoT_Edge_Sensor_Nodes_Design.pdf");
        p3.setFileUrl("/uploads/sample_iot_proposal.pdf");
        p3.setCreatedAt(LocalDateTime.now().minusDays(20));
        p3.setUpdatedAt(LocalDateTime.now().minusDays(5));

        projectRepository.saveAll(List.of(p1, p2, p3));

        // 3. Seed Proposals
        ProposalDocument doc1 = new ProposalDocument(null, p1.getId(), p1.getFileName(), p1.getFileUrl(), 1, LocalDateTime.now().minusDays(10));
        ProposalDocument doc2 = new ProposalDocument(null, p2.getId(), p2.getFileName(), p2.getFileUrl(), 1, LocalDateTime.now().minusDays(15));
        ProposalDocument doc3 = new ProposalDocument(null, p3.getId(), p3.getFileName(), p3.getFileUrl(), 1, LocalDateTime.now().minusDays(20));
        proposalDocumentRepository.saveAll(List.of(doc1, doc2, doc3));

        // 4. Seed Milestones
        MilestoneHistory m1 = new MilestoneHistory(null, p1.getId(), "Proposal Submitted", "COMPLETED", "Initial PDF abstract uploaded", LocalDateTime.now().minusDays(10));
        MilestoneHistory m2 = new MilestoneHistory(null, p1.getId(), "Faculty Evaluation", "IN_PROGRESS", "Under review by Dr. Robert Vance", LocalDateTime.now().minusDays(8));

        MilestoneHistory m3 = new MilestoneHistory(null, p2.getId(), "Proposal Submitted", "COMPLETED", "Proposal uploaded", LocalDateTime.now().minusDays(15));
        MilestoneHistory m4 = new MilestoneHistory(null, p2.getId(), "Faculty Evaluation", "COMPLETED", "Approved by Dr. Emily Carter", LocalDateTime.now().minusDays(7));
        MilestoneHistory m5 = new MilestoneHistory(null, p2.getId(), "Ready for IP Filing", "COMPLETED", "Endorsed for patent eligibility", LocalDateTime.now().minusDays(1));

        MilestoneHistory m6 = new MilestoneHistory(null, p3.getId(), "Proposal Submitted", "COMPLETED", "Proposal submitted", LocalDateTime.now().minusDays(20));
        MilestoneHistory m7 = new MilestoneHistory(null, p3.getId(), "Proposal Approved", "COMPLETED", "Approved by Dr. Robert Vance", LocalDateTime.now().minusDays(5));

        milestoneRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7));

        // 5. Seed Reviews
        Review r1 = new Review(null, p2.getId(), u4.getId(), u4.getFullName(), "READY_FOR_IP", "Excellent novel methodology on Zero-Knowledge Proof integration. Highly recommended for patent protection under the institutional IP cell track.", LocalDateTime.now().minusDays(1));
        Review r2 = new Review(null, p3.getId(), u3.getId(), u3.getFullName(), "APPROVED", "Thorough hardware schematics and clear power budget analysis. Approved for prototype deployment.", LocalDateTime.now().minusDays(5));
        reviewRepository.saveAll(List.of(r1, r2));

        // 6. Seed IP Filings
        IpFiling ip1 = new IpFiling(
                null,
                p2.getId(),
                p2.getTitle(),
                p2.getStudentName(),
                IpFiling.IpType.PATENT,
                "IN202641098234",
                IpFiling.FilingStatus.DRAFTED,
                LocalDate.now().minusDays(1),
                "Sarah Williams, Dr. Emily Carter",
                "Patent claims drafted. Awaiting institutional IP cell clearance for official IPO submission.",
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().minusDays(1)
        );
        ipFilingRepository.save(ip1);

        System.out.println("Nexus-AI Seed Data successfully initialized.");
    }
}
