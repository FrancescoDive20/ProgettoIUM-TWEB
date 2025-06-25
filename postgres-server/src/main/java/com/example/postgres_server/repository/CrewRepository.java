package com.example.postgres_server.repository;

import com.example.postgres_server.model.Crew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {
    @Query("SELECT DISTINCT c FROM Crew c WHERE c.movie.id = :movieId")
    List<Crew> findDistinctByMovieId(@Param("movieId") Long movieId);
    List<Crew> findByNameContainingIgnoreCase(String name);
    List<Crew> findByRoleContainingIgnoreCase(String role);
}
