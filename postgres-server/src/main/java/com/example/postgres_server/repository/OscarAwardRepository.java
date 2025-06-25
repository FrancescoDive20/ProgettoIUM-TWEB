package com.example.postgres_server.repository;

import com.example.postgres_server.model.OscarAward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OscarAwardRepository extends JpaRepository<OscarAward, Long> {

    @Query("SELECT o FROM OscarAward o WHERE o.film = :film AND o.yearFilm = :yearFilm")
    List<OscarAward> findAwardsByMovie(@Param("film") String film, @Param("yearFilm") Integer yearFilm);
    List<OscarAward> findByYearFilm(Integer yearFilm);
    List<OscarAward> findByCategoryContainingIgnoreCase(String category);
    List<OscarAward> findByWinner(Boolean winner);

    @Query("SELECT o FROM OscarAward o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :actorName, '%')) ")
    List<OscarAward> findOscarAwardsByActorName(@Param("actorName") String actorName);



}
