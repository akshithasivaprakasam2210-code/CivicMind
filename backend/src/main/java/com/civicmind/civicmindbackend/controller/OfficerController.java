package com.civicmind.civicmindbackend.controller;

import com.civicmind.civicmindbackend.model.Officer;
import com.civicmind.civicmindbackend.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin(origins = "*")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    @PostMapping("/register")
    public Officer registerOfficer(@RequestBody Officer officer) {

        System.out.println("========= REGISTER API =========");
        System.out.println("NAME = " + officer.getName());
        System.out.println("EMAIL = " + officer.getEmail());
        System.out.println("AREA = " + officer.getArea());

        return officerService.saveOfficer(officer);
    }

    @GetMapping("/area/{area}")
    public List<Officer> getOfficerByArea(@PathVariable String area) {
        return officerService.getOfficersByArea(area);
    }

    @PostMapping("/login")
    public Officer login(@RequestBody Officer officer) {

        System.out.println("========= LOGIN API =========");
        System.out.println("EMAIL = " + officer.getEmail());
        System.out.println("PASSWORD = " + officer.getPassword());

        Officer loggedOfficer =
                officerService.login(officer.getEmail(), officer.getPassword());

        System.out.println("RESULT = " + loggedOfficer);

        return loggedOfficer;
    }

}