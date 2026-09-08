package com.campus.research.service;

import com.campus.research.dto.IpFilingRequest;
import com.campus.research.dto.IpStatsResponse;
import com.campus.research.model.IpFiling;
import com.campus.research.model.Project;
import com.campus.research.repository.IpFilingRepository;
import com.campus.research.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IpFilingService {

    private final IpFilingRepository ipFilingRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneService milestoneService;

    public IpFilingService(
            IpFilingRepository ipFilingRepository,
            ProjectRepository projectRepository,
            MilestoneService milestoneService
    ) {
        this.ipFilingRepository = ipFilingRepository;
        this.projectRepository = projectRepository;
        this.milestoneService = milestoneService;
    }

    public List<IpFiling> getAllFilings() {
        return ipFilingRepository.findAllByOrderByUpdatedAtDesc();
    }

    public Optional<IpFiling> getFilingById(Long id) {
        return ipFilingRepository.findById(id);
    }

    public Optional<IpFiling> getFilingByProjectId(Long projectId) {
        return ipFilingRepository.findByProjectId(projectId);
    }

    public IpFiling createOrUpdateFiling(IpFilingRequest request) {
        IpFiling filing = null;
        if (request.getProjectId() != null) {
            Optional<IpFiling> existingOpt = ipFilingRepository.findByProjectId(request.getProjectId());
            if (existingOpt.isPresent()) {
                filing = existingOpt.get();
            }
        }
        if (filing == null) {
            filing = new IpFiling();
        }

        filing.setProjectId(request.getProjectId());

        // Resolve Project details if available
        if (request.getProjectId() != null) {
            Optional<Project> projOpt = projectRepository.findById(request.getProjectId());
            if (projOpt.isPresent()) {
                Project p = projOpt.get();
                filing.setProjectTitle(p.getTitle());
                filing.setStudentName(p.getStudentName());
            }
        }

        if (request.getProjectTitle() != null && !request.getProjectTitle().isBlank()) {
            filing.setProjectTitle(request.getProjectTitle().trim());
        }
        if (request.getStudentName() != null && !request.getStudentName().isBlank()) {
            filing.setStudentName(request.getStudentName().trim());
        }
        if (filing.getProjectTitle() == null || filing.getProjectTitle().isBlank()) {
            filing.setProjectTitle("Campus Research Invention");
        }
        if (filing.getStudentName() == null || filing.getStudentName().isBlank()) {
            filing.setStudentName("Institutional Researcher");
        }

        if (request.getIpType() != null) {
            try {
                filing.setIpType(IpFiling.IpType.valueOf(request.getIpType().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getApplicationNo() != null && !request.getApplicationNo().isBlank()) {
            filing.setApplicationNo(request.getApplicationNo().trim());
        } else if (filing.getApplicationNo() == null) {
            filing.setApplicationNo("IN-" + System.currentTimeMillis());
        }

        if (request.getFilingStatus() != null) {
            try {
                filing.setFilingStatus(IpFiling.FilingStatus.valueOf(request.getFilingStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getFilingDate() != null && !request.getFilingDate().isBlank()) {
            try {
                filing.setFilingDate(LocalDate.parse(request.getFilingDate()));
            } catch (Exception ignored) {}
        } else if (filing.getFilingDate() == null) {
            filing.setFilingDate(LocalDate.now());
        }

        if (request.getInventors() != null) {
            filing.setInventors(request.getInventors());
        }

        if (request.getNotes() != null) {
            filing.setNotes(request.getNotes());
        }

        filing.setUpdatedAt(LocalDateTime.now());
        IpFiling saved = ipFilingRepository.save(filing);

        // Record milestone trigger only if projectId is provided
        if (request.getProjectId() != null) {
            milestoneService.recordMilestone(
                    request.getProjectId(),
                    "IP Filing: " + saved.getIpType() + " (" + saved.getFilingStatus() + ")",
                    "COMPLETED",
                    "Application: " + saved.getApplicationNo() + " | Status: " + saved.getFilingStatus()
            );
        }

        return saved;
    }

    public IpFiling updateFiling(Long id, IpFilingRequest request) {
        IpFiling filing = ipFilingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IP Filing not found with id: " + id));

        if (request.getProjectTitle() != null && !request.getProjectTitle().isBlank()) {
            filing.setProjectTitle(request.getProjectTitle().trim());
        }
        if (request.getStudentName() != null && !request.getStudentName().isBlank()) {
            filing.setStudentName(request.getStudentName().trim());
        }

        if (request.getIpType() != null) {
            try {
                filing.setIpType(IpFiling.IpType.valueOf(request.getIpType().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getApplicationNo() != null) {
            filing.setApplicationNo(request.getApplicationNo());
        }

        if (request.getFilingStatus() != null) {
            try {
                filing.setFilingStatus(IpFiling.FilingStatus.valueOf(request.getFilingStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getFilingDate() != null && !request.getFilingDate().isBlank()) {
            try {
                filing.setFilingDate(LocalDate.parse(request.getFilingDate()));
            } catch (Exception ignored) {}
        }

        if (request.getInventors() != null) {
            filing.setInventors(request.getInventors());
        }

        if (request.getNotes() != null) {
            filing.setNotes(request.getNotes());
        }

        filing.setUpdatedAt(LocalDateTime.now());
        IpFiling saved = ipFilingRepository.save(filing);

        // If status changed to GRANTED or FILED, update project status
        if (filing.getProjectId() != null) {
            projectRepository.findById(filing.getProjectId()).ifPresent(p -> {
                if (saved.getFilingStatus() == IpFiling.FilingStatus.GRANTED) {
                    p.setCurrentMilestone("Patent / IP Granted");
                } else if (saved.getFilingStatus() == IpFiling.FilingStatus.FILED) {
                    p.setStatus(Project.Status.IP_FILED);
                    p.setCurrentMilestone("IP Application Filed (" + saved.getApplicationNo() + ")");
                }
                projectRepository.save(p);
            });
        }

        return saved;
    }

    public IpStatsResponse getStats() {
        long total = ipFilingRepository.count();
        long granted = ipFilingRepository.countByFilingStatus(IpFiling.FilingStatus.GRANTED);
        long underExam = ipFilingRepository.countByFilingStatus(IpFiling.FilingStatus.UNDER_EXAMINATION);
        long filed = ipFilingRepository.countByFilingStatus(IpFiling.FilingStatus.FILED);
        long drafted = ipFilingRepository.countByFilingStatus(IpFiling.FilingStatus.DRAFTED);

        return IpStatsResponse.builder()
                .totalFilings(total)
                .granted(granted)
                .underExamination(underExam)
                .filed(filed)
                .drafted(drafted)
                .build();
    }

    public void deleteFiling(Long id) {
        ipFilingRepository.deleteById(id);
    }
}
