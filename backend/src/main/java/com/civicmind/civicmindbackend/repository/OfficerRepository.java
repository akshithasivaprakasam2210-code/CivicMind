package com.civicmind.civicmindbackend.repository;

import com.civicmind.civicmindbackend.model.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {

    List<Officer> findByArea(String area);

    Optional<Officer> findByEmailAndPassword(String email, String password);
    Optional<Officer> findByEmail(String email);

    Optional<Officer> findByPassword(String password);
}