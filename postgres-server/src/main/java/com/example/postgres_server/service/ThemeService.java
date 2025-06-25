package com.example.postgres_server.service;

import com.example.postgres_server.model.Theme;
import com.example.postgres_server.repository.ThemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ThemeService {
    @Autowired
    private ThemeRepository themeRepository;

    public List<Theme> getThemesByMovieId(Long movieId) {
        return themeRepository.findDistinctByMovieId(movieId);
    }

    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }

    public List<Map<String, Object>> getThemesOverTime() {
        List<Object[]> results = themeRepository.findThemesOverTime();
        return results.stream().map(row -> Map.of("year", row[0], "theme", row[1],
                "count", ((Number) row[2]).intValue())).toList();
    }
}
