package com.example.postgres_server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;


@Data
@Entity
@Table(name = "languages")
@IdClass(Language.LanguageId.class)
public class Language {
    @Id
    private Long id;

    private String type;
    private String language;

    @ManyToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Movie movie;

    @Data
    public static class LanguageId implements Serializable {
        private Long id;
        private String type;
        private String language;
    }
}
