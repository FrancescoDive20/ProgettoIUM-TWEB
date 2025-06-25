package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "studios")
@IdClass(Studio.StudioId.class)
public class Studio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studio;

    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class StudioId implements Serializable {
        private Long id;
        private String studio;
    }
}
