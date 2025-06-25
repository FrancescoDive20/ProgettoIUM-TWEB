package com.example.postgres_server.repository;

import com.example.postgres_server.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    @Query("SELECT DISTINCT l FROM Language l WHERE l.movie.id = :movieId")
    List<Language> findDistinctByMovieId(@Param("movieId") Long movieId);

    @Query("SELECT DISTINCT m.date AS year, l.language AS language, COUNT(*) AS cnt FROM Movie " +
            "m JOIN Language l ON m.id = l.id WHERE m.date IS NOT NULL " +
            "GROUP BY m.date, l.language ORDER BY m.date")
    List<Object[]> findLanguagesOverTime();

}
