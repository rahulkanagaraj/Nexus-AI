package com.campus.research.service;

import com.campus.research.dto.ReviewRequest;
import com.campus.research.model.IpFiling;
import com.campus.research.model.Project;
import com.campus.research.model.Review;
import com.campus.research.model.User;
import com.campus.research.repository.IpFilingRepository;
import com.campus.research.repository.ProjectRepository;
import com.campus.research.repository.ReviewRepository;
import com.campus.research.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneService milestoneService;
    private final IpFilingRepository ipFilingRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            MilestoneService milestoneService,
            IpFilingRepository ipFilingRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.milestoneService = milestoneService;
        this.ipFilingRepository = ipFilingRepository;
    }

    public List<Review> getReviewsForProject(Long projectId) {
        return reviewRepository.findByProjectIdOrderByReviewedAtDesc(projectId);
    }

    @Transactional
    public Review submitReview(ReviewRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));

        String facultyName = "Faculty Mentor";
        if (request.getFacultyId() != null) {
            User faculty = userRepository.findById(request.getFacultyId()).orElse(null);
            if (faculty != null) {
                facultyName = faculty.getFullName();
                project.setFacultyId(faculty.getId());
                project.setFacultyName(faculty.getFullName());
            }
        }

        Review review = new Review();
        review.setProjectId(request.getProjectId());
        review.setFacultyId(request.getFacultyId() != null ? request.getFacultyId() : 0L);
        review.setFacultyName(facultyName);
        review.setStatusChange(request.getStatusChange());
        review.setFeedbackText(request.getFeedbackText());
        review.setReviewedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);

        // Automated Milestone Engine & Project Status Transitions
        String statusChange = request.getStatusChange().toUpperCase();
        switch (statusChange) {
            case "APPROVED":
                project.setStatus(Project.Status.APPROVED);
                project.setCurrentMilestone("Proposal Approved");
                milestoneService.recordMilestone(
                        project.getId(),
                        "Proposal Approved",
                        "COMPLETED",
                        "Approved by " + facultyName + ". Mentor feedback: " + request.getFeedbackText()
                );
                break;

            case "REVISION_REQUESTED":
                project.setStatus(Project.Status.REVISION_REQUESTED);
                project.setCurrentMilestone("Revision Requested");
                milestoneService.recordMilestone(
                        project.getId(),
                        "Revision Requested",
                        "IN_PROGRESS",
                        "Mentor requested changes: " + request.getFeedbackText()
                );
                break;

            case "READY_FOR_IP":
                project.setStatus(Project.Status.READY_FOR_IP);
                project.setCurrentMilestone("Ready for IP Filing");
                milestoneService.recordMilestone(
                        project.getId(),
                        "Ready for IP Filing",
                        "COMPLETED",
                        "Endorsed for patent/IP protection by " + facultyName
                );

                // Auto-trigger IP Filing creation in collaborative tracker if not exists
                if (ipFilingRepository.findByProjectId(project.getId()).isEmpty()) {
                    IpFiling ip = new IpFiling();
                    ip.setProjectId(project.getId());
                    ip.setProjectTitle(project.getTitle());
                    ip.setStudentName(project.getStudentName());
                    ip.setIpType(IpFiling.IpType.PATENT);
                    ip.setApplicationNo("TEMP-IN-" + System.currentTimeMillis() % 1000000);
                    ip.setFilingStatus(IpFiling.FilingStatus.DRAFTED);
                    ip.setFilingDate(LocalDate.now());
                    ip.setInventors(project.getStudentName() + ", " + facultyName);
                    ip.setNotes("Automatically initiated upon faculty IP endorsement. Ready for Institutional IP Cell review.");
                    ip.setCreatedAt(LocalDateTime.now());
                    ip.setUpdatedAt(LocalDateTime.now());
                    ipFilingRepository.save(ip);
                }
                break;

            case "UNDER_REVIEW":
                project.setStatus(Project.Status.UNDER_REVIEW);
                project.setCurrentMilestone("Faculty Evaluation");
                milestoneService.recordMilestone(
                        project.getId(),
                        "Faculty Evaluation",
                        "IN_PROGRESS",
                        "Assigned to " + facultyName + " for evaluation"
                );
                break;

            case "REJECTED":
                project.setStatus(Project.Status.REJECTED);
                project.setCurrentMilestone("Proposal Rejected");
                milestoneService.recordMilestone(
                        project.getId(),
                        "Proposal Rejected",
                        "TERMINATED",
                        "Proposal not accepted: " + request.getFeedbackText()
                );
                break;

            default:
                project.setCurrentMilestone("Under Faculty Review");
                break;
        }

        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);

        return savedReview;
    }
}
