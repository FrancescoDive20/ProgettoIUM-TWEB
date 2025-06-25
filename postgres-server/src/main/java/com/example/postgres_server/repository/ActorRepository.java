package com.example.postgres_server.repository;

import com.example.postgres_server.model.Actor;
import com.example.postgres_server.model.OscarAward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Long> {
    @Query("SELECT DISTINCT a FROM Actor a WHERE a.movie.id = :movieId")
    List<Actor> findDistinctByMovieId(@Param("movieId") Long movieId);
    List<Actor> findByNameContainingIgnoreCase(String name);
    List<Actor> findByRoleContainingIgnoreCase(String role);

    @Query("SELECT DISTINCT name, COUNT(*) AS apperances FROM Actor GROUP BY name ORDER BY apperances DESC LIMIT 20")
    List<Object[]> findTopActors();

    @Query("SELECT m.id, m.name, m.date, m.description, a.role, m.rating " +
            "FROM Movie m JOIN Actor a ON m.id = a.id " +
            "WHERE a.name = :actorName")
    List<Object[]> findFilmographyByActorName(@Param("actorName") String actorName);

    @Query("SELECT AVG(m.rating) FROM Movie m JOIN Actor a ON m.id = a.id " +
            "WHERE a.name = :actorName")
    Double findAverageRatingByActorName(@Param("actorName") String actorName);

    @Query("SELECT o FROM OscarAward o WHERE o.name = :actorName")
    List<OscarAward> findOscarsByActorName(@Param("actorName") String actorName);

    @Query("SELECT DISTINCT a FROM Actor a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND LOWER(a.role) LIKE LOWER(CONCAT('%', :role, '%'))")
    List<Actor> findByNameAndRole(String name, String role);
}
