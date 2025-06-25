package com.example.postgres_server.service;

import com.example.postgres_server.model.Country;
import com.example.postgres_server.model.Crew;
import com.example.postgres_server.repository.CountryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public Page<Country> getAllCountries(Pageable pageable) {
        return countryRepository.findAll(pageable);
    }

    public List<Country> getCountryByMovieId(Long movieId) {
        List<Country> countryList = countryRepository.findDistinctByMovieId(movieId);
        return countryList;
    }

    public Country saveCountry(Country country) {
        return countryRepository.save(country);
    }

}
