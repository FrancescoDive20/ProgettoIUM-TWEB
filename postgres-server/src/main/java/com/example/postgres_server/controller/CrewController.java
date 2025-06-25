package com.example.postgres_server.controller;

import com.example.postgres_server.model.Crew;
import com.example.postgres_server.service.CrewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/crew")
public class CrewController {
    @Autowired
    private CrewService crewService;

    @GetMapping
    public List<Crew> searchCrew(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String role) {
        return crewService.searchCrew(name, role);
    }

    @GetMapping("/movies/{movieId}")
    public List<Crew> getCrewByMovieId(@PathVariable Long movieId) {
        return crewService.getCrewByMovieId(movieId);
    }
}
