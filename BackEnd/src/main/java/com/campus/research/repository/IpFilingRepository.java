package com.campus.research.repository;

import com.campus.research.model.IpFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IpFilingRepository extends JpaRepository<IpFiling, Long> {
    Optional<IpFiling> findByProjectId(Long projectId);
    List<IpFiling> findByFilingStatus(IpFiling.FilingStatus filingStatus);
    List<IpFiling> findByIpType(IpFiling.IpType ipType);
    List<IpFiling> findAllByOrderByUpdatedAtDesc();
    long countByFilingStatus(IpFiling.FilingStatus filingStatus);
}
