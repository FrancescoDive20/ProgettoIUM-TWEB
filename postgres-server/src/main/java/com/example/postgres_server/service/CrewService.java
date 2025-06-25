package com.example.postgres_server.service;

import com.example.postgres_server.model.Crew;
import com.example.postgres_server.repository.CrewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrewService {
    @Autowired
    private CrewRepository crewRepository;

    public List<Crew> getCrewByMovieId(Long movieId) {
        List<Crew> crewList = crewRepository.findDistinctByMovieId(movieId);
        return crewList;
    }

    public List<Crew> searchCrew(String name, String role) {
        if (name != null) {
            return crewRepository.findByNameContainingIgnoreCase(name);
        } else if (role != null) {
            return crewRepository.findByRoleContainingIgnoreCase(role);
        }
        return crewRepository.findAll();
    }
}
