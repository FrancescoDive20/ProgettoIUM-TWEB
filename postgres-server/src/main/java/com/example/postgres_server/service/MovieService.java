package com.example.postgres_server.service;

import com.example.postgres_server.model.Movie;
import com.example.postgres_server.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    public Page<Movie> getMovies(String name, Integer date, PageRequest pageRequest) {
        if (name != null && date != null) {
            return movieRepository.findByNameContainingIgnoreCaseAndDate(name, date, pageRequest);
        } else if (name != null) {
            return movieRepository.findByNameContainingIgnoreCase(name, pageRequest);
        } else {
            return movieRepository.findAll(pageRequest);
        }
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }

    public Movie getMovieWithDetails(Long id) {
        return movieRepository.findWithDetailsById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<Map<String, Object>> getRuntimeVsRating() {
        List<Object[]> results = movieRepository.findRuntimeVsRating();
        return results.stream().map(row -> Map.of("runtime", row[0], "rating", row[1])).toList();
    }

}

