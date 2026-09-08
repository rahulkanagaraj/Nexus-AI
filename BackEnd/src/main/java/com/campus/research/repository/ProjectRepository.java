package com.campus.research.repository;

import com.campus.research.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Project> findByFacultyIdOrderByCreatedAtDesc(Long facultyId);
    List<Project> findByStatus(Project.Status status);
    List<Project> findAllByOrderByCreatedAtDesc();
}
