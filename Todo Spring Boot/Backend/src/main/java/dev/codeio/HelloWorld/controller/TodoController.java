package dev.codeio.HelloWorld.controller;

import dev.codeio.HelloWorld.service.TodoService;
import dev.codeio.HelloWorld.models.Todo;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    @ApiResponses({
            @ApiResponse(responseCode = "200",description = "Todo retrived successfully"),
            @ApiResponse(responseCode = "404",description = "Todo was not found")
    })


    @GetMapping("/{id}")
    ResponseEntity<Todo> getTodoId(@PathVariable Long id){
        try{
            Todo createdTodo = todoService.getTodoById(id);
            return new ResponseEntity<>(createdTodo, HttpStatus.OK );
        }catch(RuntimeException exception){
            return new ResponseEntity<>(todoService.getTodoById(id), HttpStatus.NOT_FOUND );
        }

    }

    @GetMapping("/page")
    ResponseEntity<Page<Todo>> getTodosPaged(@RequestParam int page,@RequestParam int size){
        return new ResponseEntity<>(todoService.getAllTodosPage(page,size), HttpStatus.OK);
    }


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
