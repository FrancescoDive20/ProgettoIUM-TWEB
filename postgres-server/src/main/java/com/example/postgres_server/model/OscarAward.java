package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "oscar_awards")
@IdClass(OscarAward.OscarAwardId.class)
public class OscarAward {

    @Id
    private Integer yearFilm;

    @Id
    private String category;

    @Id
    private String film;

    private Integer yearCeremony;
    private String ceremony;

    @Column(name = "name")
    private String name;
    private Boolean winner;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "yearFilm", referencedColumnName = "date", insertable = false, updatable = false),
            @JoinColumn(name = "film", referencedColumnName = "name", insertable = false, updatable = false)
    })
    private Movie movie;

    @Data
    public static class OscarAwardId implements Serializable {
        private Integer yearFilm;
        private String category;
        private String film;
    }
}
