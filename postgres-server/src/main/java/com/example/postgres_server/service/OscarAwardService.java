package com.example.postgres_server.service;

import com.example.postgres_server.model.OscarAward;
import com.example.postgres_server.repository.OscarAwardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OscarAwardService {
    @Autowired
    private OscarAwardRepository oscarAwardRepository;

    public List<OscarAward> getAwardsByMovie(String film, Integer yearFilm) {
        return oscarAwardRepository.findAwardsByMovie(film, yearFilm);
    }

    public List<OscarAward> searchAwards(Integer yearFilm, String category, Boolean winner) {
        if (yearFilm != null) {
            return oscarAwardRepository.findByYearFilm(yearFilm);
        } else if (category != null) {
            return oscarAwardRepository.findByCategoryContainingIgnoreCase(category);
        } else if (winner != null) {
            return oscarAwardRepository.findByWinner(winner);
        }
        return oscarAwardRepository.findAll();
    }

    public List<OscarAward> getOscarsByActorName(String actorName) {
        if (actorName == null || actorName.isEmpty()) {
            return List.of();
        }
        try {
            return oscarAwardRepository.findOscarAwardsByActorName(actorName);
        } catch (Exception e) {
            System.err.println("Errore recupero oscar per attore " + actorName + ": " + e.getMessage());
            return List.of();
        }
    }

}
