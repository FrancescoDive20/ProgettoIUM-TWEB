package com.example.postgres_server.controller;

import com.example.postgres_server.model.Actor;
import com.example.postgres_server.model.OscarAward;
import com.example.postgres_server.service.ActorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/actors")
public class ActorController {
    @Autowired
    private ActorService actorService;

    @GetMapping
    public List<Actor> searchActors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String role) {
        return actorService.searchActors(name, role);
    }

    @GetMapping("/movies/{movieId}")
    public List<Actor> getActorsByMovieId(@PathVariable Long movieId) {
        return actorService.getActorsByMovieId(movieId);
    }

    @GetMapping("/top-actors")
    public List<Map<String, Object>> getTopActors() {
        return actorService.getTopActors();
    }

    @GetMapping("/details/{name}")
    public ResponseEntity<Map<String, Object>> getActorDetails(
            @PathVariable String name,
            @RequestParam(required = false) String role) {

        Map<String, Object> details = actorService.getActorDetails(name, role);
        if (details == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(details);
    }

    @GetMapping("/filmography/{name}")
    public ResponseEntity<?> getFilmographyByName(@PathVariable String name) {
        List<Actor> actors = actorService.searchActors(name, null);
        if (actors.isEmpty()) return ResponseEntity.notFound().build();

        Actor actor = actors.get(0); //Prendiamo il primo risultato che combacia
        Map<String, Object> details = actorService.getActorDetails(actor.getName(), actor.getRole());

        if (details == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(details.get("filmography"));
    }

    @GetMapping("/average-rating/")
    public ResponseEntity<Double> getAverageRating(@RequestParam String name) {
        Double avgRating = actorService.getAverageRatingByActorName(name);
        if (avgRating == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(avgRating);
    }

    @GetMapping("/oscars")
    public ResponseEntity<List<OscarAward>> getOscarsByActorName(@RequestParam String name) {
        List<OscarAward> oscars = actorService.getOscarsByActorName(name);
        if (oscars == null || oscars.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(oscars);
    }
}
