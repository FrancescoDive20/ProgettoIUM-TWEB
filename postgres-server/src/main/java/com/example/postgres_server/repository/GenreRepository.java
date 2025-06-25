package com.example.postgres_server.repository;

import com.example.postgres_server.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    @Query("SELECT DISTINCT g FROM Genre g WHERE g.movie.id = :movieId")
    List<Genre> findDistinctByMovieId(@Param("movieId") Long movieId);

    @Query("SELECT DISTINCT m.date AS year, g.genre AS item, COUNT(*) AS cnt " +
            "FROM Movie m JOIN Genre g ON m.id = g.id WHERE m.date IS NOT NULL " +
            "GROUP BY m.date, g.genre ORDER BY m.date")
    List<Object[]> findGenresOverTime();
}
