package com.civicmind.civicmindbackend.repository;

import com.civicmind.civicmindbackend.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByOfficerId(Long officerId);

    List<Grievance> findByArea(String area);
    List<Grievance> findByCitizenEmail(String citizenEmail);

}