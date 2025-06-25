package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "actors")
@IdClass(Actor.ActorId.class)
public class Actor {
    @Id
    private Long id;

    @Id
    private String name;

    @Id
    private String role;

    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class ActorId implements Serializable {
        private Long id;
        private String name;
        private String role;
    }
}
