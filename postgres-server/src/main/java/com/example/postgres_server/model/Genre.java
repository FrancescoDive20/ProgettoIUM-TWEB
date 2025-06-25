package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;


@Data
@Entity
@Table(name = "genres")
@IdClass(Genre.GenreId.class)
public class Genre {
    @Id
    private Long id;

    private String genre;

    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class GenreId implements Serializable {
        private Long id;
        private String genre;
    }
}
