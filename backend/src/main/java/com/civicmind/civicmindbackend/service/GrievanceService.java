package com.civicmind.civicmindbackend.service;
import com.civicmind.civicmindbackend.repository.OfficerRepository;
import com.civicmind.civicmindbackend.model.Officer;
import com.civicmind.civicmindbackend.model.Grievance;
import com.civicmind.civicmindbackend.repository.GrievanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GrievanceService {

    @Autowired
    private GrievanceRepository grievanceRepository;
    @Autowired
    private OfficerRepository officerRepository;

    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }
    public List<Grievance> getGrievancesByOfficer(Long officerId) {
        return grievanceRepository.findByOfficerId(officerId);
    }
    public List<Grievance> getGrievancesByCitizen(String citizenEmail) {
        return grievanceRepository.findByCitizenEmail(citizenEmail);
    }
    public List<Grievance> getGrievancesByArea(String area) {
        return grievanceRepository.findByArea(area);
    }

    public Grievance saveGrievance(Grievance grievance) {

        grievance.setStatus("Pending");

        // IMPORTANT: keep the citizen email received from the frontend
        grievance.setCitizenEmail(grievance.getCitizenEmail());

        List<Officer> officers = officerRepository.findByArea(grievance.getArea());

        if (!officers.isEmpty()) {
            grievance.setOfficerId(officers.get(0).getId());
        }

        return grievanceRepository.save(grievance);
    }

    public Grievance getGrievanceById(Long id) {
        Optional<Grievance> grievance = grievanceRepository.findById(id);
        return grievance.orElse(null);
    }

    public Grievance updateStatus(Long id, String status) {
        Grievance grievance = getGrievanceById(id);

        if (grievance != null) {
            grievance.setStatus(status);
            return grievanceRepository.save(grievance);
        }

        return null;
    }
}