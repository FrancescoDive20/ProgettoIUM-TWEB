package com.example.postgres_server.repository;

import com.example.postgres_server.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    @Query("SELECT DISTINCT c FROM Country c WHERE c.movie.id = :movieId")
    List<Country> findDistinctByMovieId(@Param("movieId") Long movieId);
}
