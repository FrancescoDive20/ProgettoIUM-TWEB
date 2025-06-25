package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Table(name = "countries")
@IdClass(Country.CountryId.class)
public class Country {

    @Id
    private Long id;

    private String country;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class CountryId implements Serializable {
        private Long id;
        private String country;
    }
}
