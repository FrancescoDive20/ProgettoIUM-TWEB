package com.example.postgres_server.service;

import com.example.postgres_server.model.Genre;
import com.example.postgres_server.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GenreService {
    @Autowired
    private GenreRepository genreRepository;

    public List<Genre> getGenresByMovieId(Long movieId) {
        return genreRepository.findDistinctByMovieId(movieId);
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public List<Map<String, Object>> getGenresOverTime() {
        List<Object[]> results = genreRepository.findGenresOverTime();
        return results.stream().map(row -> Map.of("year", row[0], "genre", row[1],
                "count", ((Number) row[2]).intValue())).toList();
    }
}
