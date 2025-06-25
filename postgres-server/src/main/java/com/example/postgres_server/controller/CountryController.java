package com.example.postgres_server.controller;

import com.example.postgres_server.model.Country;
import com.example.postgres_server.service.CountryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public Page<Country> getAllCountries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return countryService.getAllCountries(PageRequest.of(page, size));
    }

    @GetMapping("/movies/{movieId}")
    public List<Country> getCountryByMovieId(@PathVariable Long movieId) {
        return countryService.getCountryByMovieId(movieId);
    }

    @PostMapping
    public Country createCountry(@RequestBody Country country) {
        return countryService.saveCountry(country);
    }
}
