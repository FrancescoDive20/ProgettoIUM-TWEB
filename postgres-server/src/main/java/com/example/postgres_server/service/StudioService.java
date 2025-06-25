package com.example.postgres_server.service;

import com.example.postgres_server.model.Studio;
import com.example.postgres_server.repository.StudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudioService {
    @Autowired
    private StudioRepository studioRepository;

    public List<Studio> getStudiosByMovieId(Long movieId) {
        return studioRepository.findDistinctByMovieId(movieId);
    }

    public List<Studio> getAllStudios() {
        return studioRepository.findAll();
    }
}
