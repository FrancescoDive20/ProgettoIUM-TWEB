package com.example.postgres_server.service;

import com.example.postgres_server.model.Language;
import com.example.postgres_server.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LanguageService {
    @Autowired
    private LanguageRepository languageRepository;

    public List<Language> getLanguagesByMovieId(Long movieId) {
        return languageRepository.findDistinctByMovieId(movieId);
    }

    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }

    public List<Map<String, Object>> getLanguagesOverTime() {
        List<Object[]> results = languageRepository.findLanguagesOverTime();
        return results.stream().map(row -> Map.of("year", row[0], "language", row[1],
                "count", ((Number) row[2]).intValue())).toList();
    }
}
