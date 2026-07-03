package com.civicmind.civicmindbackend.controller;

import com.civicmind.civicmindbackend.model.Grievance;
import com.civicmind.civicmindbackend.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "*")
public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @GetMapping
    public List<Grievance> getAllGrievances() {
        return grievanceService.getAllGrievances();
    }

    @GetMapping("/officer/{officerId}")
    public List<Grievance> getGrievancesByOfficer(@PathVariable Long officerId) {
        return grievanceService.getGrievancesByOfficer(officerId);
    }
    @GetMapping("/area/{area}")
    public List<Grievance> getGrievancesByArea(@PathVariable String area) {
        return grievanceService.getGrievancesByArea(area);
    }

    @PostMapping
    public Grievance saveGrievance(@RequestBody Grievance grievance) {

        System.out.println("========== NEW GRIEVANCE ==========");
        System.out.println("Citizen Email = " + grievance.getCitizenEmail());
        System.out.println("Title = " + grievance.getTitle());

        return grievanceService.saveGrievance(grievance);
    }
    @PutMapping("/{id}/status")
    public Grievance updateStatus(@PathVariable Long id,
                                  @RequestParam String status) {
        return grievanceService.updateStatus(id, status);
    }
    @GetMapping("/citizen/{email}")
    public List<Grievance> getCitizenComplaints(@PathVariable String email) {
        return grievanceService.getGrievancesByCitizen(email);
    }

}
