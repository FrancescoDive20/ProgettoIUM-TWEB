package com.example.postgres_server.controller;

import com.example.postgres_server.model.Theme;
import com.example.postgres_server.service.ThemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/themes")
public class ThemeController {
    @Autowired
    private ThemeService themeService;

    @GetMapping
    public List<Theme> getAllThemes() {
        return themeService.getAllThemes();
    }

    @GetMapping("/movies/{movieId}")
    public List<Theme> getThemesByMovieId(@PathVariable Long movieId) {
        return themeService.getThemesByMovieId(movieId);
    }

    @GetMapping("/themes-over-time")
    public List<Map<String, Object>> getThemesOverTime() {
        return themeService.getThemesOverTime();
    }
}
