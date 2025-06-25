package com.example.postgres_server.repository;

import com.example.postgres_server.model.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudioRepository extends JpaRepository<Studio, Long> {
    @Query("SELECT DISTINCT s FROM Studio s WHERE s.movie.id = :movieId")
    List<Studio> findDistinctByMovieId(@Param("movieId") Long movieId);}
