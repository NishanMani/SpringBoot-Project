package dev.codeio.HelloWorld;

import dev.codeio.HelloWorld.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

//CRUD
public interface TodoRepository extends JpaRepository<Todo, Long> {

}
