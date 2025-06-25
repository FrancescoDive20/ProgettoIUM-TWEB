package com.example.postgres_server.repository;

import com.example.postgres_server.model.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {
    @Query("SELECT DISTINCT t FROM Theme t WHERE t.movie.id = :movieId")
    List<Theme> findDistinctByMovieId(@Param("movieId") Long movieId);

    @Query("SELECT DISTINCT m.date AS year, t.theme AS item, COUNT(*) AS cnt " +
            "FROM Movie m JOIN Theme t ON m.id = t.id WHERE m.date IS NOT NULL " +
            "GROUP BY m.date, t.theme ORDER BY m.date")
    List<Object[]> findThemesOverTime();
}
