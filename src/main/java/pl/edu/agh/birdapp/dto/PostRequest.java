package pl.edu.agh.birdapp.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class PostRequest {
    @NonNull
    String content;
    @NonNull
    String userName;
    String commentId;
}
