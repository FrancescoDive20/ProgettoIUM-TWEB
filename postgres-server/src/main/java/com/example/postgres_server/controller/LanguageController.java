package com.example.postgres_server.controller;

import com.example.postgres_server.model.Language;
import com.example.postgres_server.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/languages")
public class LanguageController {
    @Autowired
    private LanguageService languageService;

    @GetMapping
    public List<Language> getAllLanguages() {
        return languageService.getAllLanguages();
    }

    @GetMapping("/movies/{movieId}")
    public List<Language> getLanguagesByMovieId(@PathVariable Long movieId) {
        return languageService.getLanguagesByMovieId(movieId);
    }

    @GetMapping("/languages-over-time")
    public List<Map<String, Object>> getLanguagesOverTime() {
        return languageService.getLanguagesOverTime();
    }
}
