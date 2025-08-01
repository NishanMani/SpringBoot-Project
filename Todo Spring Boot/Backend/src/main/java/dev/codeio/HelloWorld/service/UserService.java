package dev.codeio.HelloWorld.service;

import dev.codeio.HelloWorld.models.User;
import dev.codeio.HelloWorld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository UserRepository;

    public User createUser(User User){
        return UserRepository.save(User);
    }
    public User getUserById(Long id){
        return UserRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

}
