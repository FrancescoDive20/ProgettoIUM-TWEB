package com.example.postgres_server.controller;

import com.example.postgres_server.model.Genre;
import com.example.postgres_server.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/genres")
public class GenreController {
    @Autowired
    private GenreService genreService;

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreService.getAllGenres();
    }

    @GetMapping("/movies/{movieId}")
    public List<Genre> getGenresByMovieId(@PathVariable Long movieId) {
        return genreService.getGenresByMovieId(movieId);
    }

    @GetMapping("/genres-over-time")
    public List<Map<String, Object>> getGenresOverTime() {
        return genreService.getGenresOverTime();
    }
}
