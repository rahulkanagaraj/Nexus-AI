package com.campus.research.repository;

import com.campus.research.model.MilestoneHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<MilestoneHistory, Long> {
    List<MilestoneHistory> findByProjectIdOrderByCreatedAtAsc(Long projectId);
    void deleteByProjectId(Long projectId);
}
