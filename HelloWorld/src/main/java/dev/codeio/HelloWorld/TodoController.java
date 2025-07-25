package dev.codeio.HelloWorld;

import dev.codeio.HelloWorld.models.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
public class TodoController {

    @Autowired
    private TodoService todoService;


    //PathVariable
    @GetMapping("/{id}")
    ResponseEntity<Todo> getTodoId(@PathVariable Long id){
        try{
            Todo createdTodo = todoService.getTodoById(id);
            return new ResponseEntity<>(createdTodo, HttpStatus.OK );
        }catch(RuntimeException exception){
            return new ResponseEntity<>(todoService.getTodoById(id), HttpStatus.NOT_FOUND );
        }

    }

    // Request Param


    //Request Body
    @PostMapping("/create")
    ResponseEntity<Todo> createUser(@RequestBody Todo todo){
        return new ResponseEntity<>(todoService.createTodo(todo), HttpStatus.CREATED);
    }

    @PutMapping
    ResponseEntity<Todo> updateTodoIdParam(@RequestBody Todo todo){
        return new ResponseEntity<>(todoService.updateTodo(todo), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    void deleteTodoIdParam(@PathVariable Long id){
        todoService.deleteTodoById(id);
    }

    @GetMapping
    ResponseEntity<List<Todo>> getTodos(){
        return new ResponseEntity<List<Todo>>(todoService.getTodos(), HttpStatus.OK);
    }

}
