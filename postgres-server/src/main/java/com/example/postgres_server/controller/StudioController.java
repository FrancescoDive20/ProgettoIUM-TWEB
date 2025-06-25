package com.example.postgres_server.controller;

import com.example.postgres_server.model.Studio;
import com.example.postgres_server.service.StudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/studios")
public class StudioController {
    @Autowired
    private StudioService studioService;

    @GetMapping
    public List<Studio> getAllStudios() {
        return studioService.getAllStudios();
    }

    @GetMapping("/movies/{movieId}")
    public List<Studio> getStudiosByMovieId(@PathVariable Long movieId) {
        return studioService.getStudiosByMovieId(movieId);
    }
}
