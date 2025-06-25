package com.example.postgres_server.controller;

import com.example.postgres_server.model.OscarAward;
import com.example.postgres_server.service.OscarAwardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/awards")
public class OscarAwardController {
    @Autowired
    private OscarAwardService awardService;

    @GetMapping
    public List<OscarAward> searchAwards(
            @RequestParam(required = false) Integer yearFilm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean winner) {
        return awardService.searchAwards(yearFilm, category, winner);
    }

    @GetMapping("/movies/{film}/{yearFilm}")
    public ResponseEntity<List<OscarAward>> getAwardsByMovie(
            @PathVariable String film,
            @PathVariable Integer yearFilm) {

        List<OscarAward> awards = awardService.getAwardsByMovie(film, yearFilm);

        if (awards.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(awards);
    }

    @GetMapping("/oscars/{name}")
    public ResponseEntity<List<OscarAward>> getOscarsByActorName(@PathVariable String name) {
        List<OscarAward> oscarAwards = awardService.getOscarsByActorName(name);
        if (oscarAwards == null) {
            oscarAwards = new ArrayList<>();
        }
        return ResponseEntity.ok(oscarAwards);
    }
}
