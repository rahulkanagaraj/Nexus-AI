package com.campus.research.repository;

import com.campus.research.model.ProposalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalDocumentRepository extends JpaRepository<ProposalDocument, Long> {
    List<ProposalDocument> findByProjectIdOrderByVersionDesc(Long projectId);
    Optional<ProposalDocument> findTopByProjectIdOrderByVersionDesc(Long projectId);
}
