package pl.edu.agh.birdapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node
@Getter
@Setter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @NonNull
    String userName;
    @Relationship(type = "CREATED", direction = Relationship.Direction.OUTGOING)
    List<Post> posts;
    @JsonIgnoreProperties("friends")
    @Relationship(type = "IS_FRIENDS", direction = Relationship.Direction.OUTGOING)
    List<User> friends;

    @Override
    public String toString() {
        return "User{" +
                "userName='" + userName + '\'' +
                ", posts=" + posts.stream().map(Post::getId).toList() +
                ", friends=" + friends.stream().map(User::getUserName).toList() +
                '}';
    }
}
