package com.example.postgres_server.controller;
import com.example.postgres_server.model.Movie;
import com.example.postgres_server.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping()
    public Page<Movie> getMovies(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return movieService.getMovies(name, date, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/{id}/details")
    public Movie getMovieWithDetails(@PathVariable Long id) {
        return movieService.getMovieWithDetails(id);
    }

    @GetMapping("/runtime-rating")
    public List<Map<String, Object>> getRuntimeVsRating() {
        return movieService.getRuntimeVsRating();
    }

}
