package com.civicmind.civicmindbackend.service;

import com.civicmind.civicmindbackend.model.Officer;
import com.civicmind.civicmindbackend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    public Officer saveOfficer(Officer officer) {
        return officerRepository.save(officer);
    }

    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    public List<Officer> getOfficersByArea(String area) {
        return officerRepository.findByArea(area);
    }
    public Officer login(String email, String password) {

        System.out.println("Checking Email...");
        System.out.println(officerRepository.findByEmail(email));

        System.out.println("Checking Password...");
        System.out.println(officerRepository.findByPassword(password));

        return officerRepository.findByEmailAndPassword(email, password)
                .orElse(null);
    }

}