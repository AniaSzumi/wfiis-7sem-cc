package pl.edu.agh.birdapp.controller;

import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.birdapp.dto.UsersResponse;
import pl.edu.agh.birdapp.model.User;
import pl.edu.agh.birdapp.repository.UsersRepository;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UsersController {
    private final UsersRepository usersRepository;

    @PostMapping()
    public ResponseEntity<Void> saveUser(@RequestBody String userName) {
        if (userName != null) {
            User user = new User(userName);
            usersRepository.save(user);
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping()
    public ResponseEntity<UsersResponse> getAllUsers() {
        return ResponseEntity.ok(new UsersResponse(usersRepository.findAll()));
    }

    @GetMapping("/friends")
    public ResponseEntity<UsersResponse> getFriends(@RequestParam String userName) {
        return ResponseEntity.ok(new UsersResponse(usersRepository.findFriends(userName)));
    }

    @PostMapping("/friends")
    public ResponseEntity<Void> setFriends(@RequestBody List<String> friends) {
        if (friends != null && friends.size() == 2) {
            Optional<User> optionalUser1 = usersRepository.findByUserName(friends.get(0));
            Optional<User> optionalUser2 = usersRepository.findByUserName(friends.get(1));
            if (optionalUser1.isPresent() && optionalUser2.isPresent()) {
                val user1 = optionalUser1.get();
                val user2 = optionalUser2.get();
                addUserToFriends(user1, user2);
                addUserToFriends(user2, user1);
            }
        }
        return ResponseEntity.ok(null);
    }

    private void addUserToFriends(User user1, User user2) {
        List<User> friends = user1.getFriends();
        friends.add(user2);
        user1.setFriends(friends);
        usersRepository.save(user1);
    }
}
