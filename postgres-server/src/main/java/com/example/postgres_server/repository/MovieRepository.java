package com.example.postgres_server.repository;

import com.example.postgres_server.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Page<Movie> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Movie> findByNameContainingIgnoreCaseAndDate(String name, Integer date, Pageable pageable);

    @EntityGraph(attributePaths = {"countries", "crew", "actors", "genres", "themes", "languages", "studios"})
    Optional<Movie> findWithDetailsById(Long id);

    @Query("SELECT m.minute, m.rating FROM Movie m WHERE m.rating IS NOT NULL AND m.minute IS NOT NULL")
    List<Object[]> findRuntimeVsRating();

}
