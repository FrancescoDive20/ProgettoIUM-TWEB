package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Data
@Entity
@Table(name = "crew")
@IdClass(Crew.CrewId.class)
public class Crew {

    @Id
    private Long id;

    @Id
    private String role;

    private String name;

    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class CrewId implements Serializable {
        private Long id;
        private String role;
    }
}
