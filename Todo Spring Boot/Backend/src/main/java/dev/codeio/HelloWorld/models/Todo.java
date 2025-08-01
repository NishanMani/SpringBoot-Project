package dev.codeio.HelloWorld.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data

public class Todo {
    @Id
    @GeneratedValue
    Long id;
    @NotNull
    @NotBlank
    String title;
    Boolean isCompleted;
}
