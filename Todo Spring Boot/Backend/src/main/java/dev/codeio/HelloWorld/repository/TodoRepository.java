package dev.codeio.HelloWorld.repository;

import dev.codeio.HelloWorld.models.Todo;
import dev.codeio.HelloWorld.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//CRUD
public interface TodoRepository extends JpaRepository<Todo, Long> {

}
