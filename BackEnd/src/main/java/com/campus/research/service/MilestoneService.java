package com.campus.research.service;

import com.campus.research.model.MilestoneHistory;
import com.campus.research.repository.MilestoneRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    public List<MilestoneHistory> getMilestonesForProject(Long projectId) {
        return milestoneRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
    }

    public MilestoneHistory recordMilestone(Long projectId, String milestoneName, String status, String notes) {
        MilestoneHistory mh = new MilestoneHistory();
        mh.setProjectId(projectId);
        mh.setMilestoneName(milestoneName);
        mh.setStatus(status);
        mh.setNotes(notes);
        mh.setCreatedAt(LocalDateTime.now());
        return milestoneRepository.save(mh);
    }
}
