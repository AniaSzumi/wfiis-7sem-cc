package pl.edu.agh.birdapp.dto;

import lombok.Data;
import lombok.NonNull;
import pl.edu.agh.birdapp.model.Post;

import java.util.List;

@Data
public class PostsResponse {
    @NonNull
    List<Post> posts;
}
