package pl.edu.agh.birdapp.dto;

import lombok.Data;
import lombok.NonNull;
import pl.edu.agh.birdapp.model.User;

import java.util.List;

@Data
public class UsersResponse {
    @NonNull
    List<User> users;
}
