package com.example.postgres_server.service;

import com.example.postgres_server.model.Actor;
import com.example.postgres_server.model.OscarAward;
import com.example.postgres_server.repository.ActorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActorService {
    @Autowired
    private ActorRepository actorRepository;

    public List<Actor> getActorsByMovieId(Long movieId) {
        return actorRepository.findDistinctByMovieId(movieId);
    }

    public List<Actor> searchActors(String name, String role) {
        if (name != null) {
            return actorRepository.findByNameContainingIgnoreCase(name);
        } else if (role != null) {
            return actorRepository.findByRoleContainingIgnoreCase(role);
        }
        return actorRepository.findAll();
    }

    public List<Map<String, Object>> getTopActors() {
        List<Object[]> results = actorRepository.findTopActors();
        return results.stream().map(row -> Map.of("name", row[0], "count", row[1])).toList();
    }

    public Map<String, Object> getActorDetails(String name, String role) {
        List<Actor> actors;
        if (role != null) {
            actors = actorRepository.findByNameAndRole(name, role);
        } else {
            actors = actorRepository.findByNameContainingIgnoreCase(name);
        }

        if (actors.isEmpty()) return null;
        Actor actor = actors.get(0);  // prendi il primo risultato

        Long movieId = actor.getId();
        String actorName = actor.getName();

        List<Object[]> filmography = actorRepository.findFilmographyByActorName(actorName);
        Double avgRating = actorRepository.findAverageRatingByActorName(actorName);
        List<OscarAward> oscars = actorRepository.findOscarsByActorName(actorName);

        Map<String, Object> result = new HashMap<>();
        result.put("name", actorName);
        result.put("filmography", filmography);
        result.put("averageRating", avgRating);
        result.put("oscars", oscars);

        return result;
    }

    public Double getAverageRatingByActorName(String actorName) {
        return actorRepository.findAverageRatingByActorName(actorName);
    }

    public List<OscarAward> getOscarsByActorName(String actorName) {
        return actorRepository.findOscarsByActorName(actorName);
    }
}