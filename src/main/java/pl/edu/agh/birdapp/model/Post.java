package pl.edu.agh.birdapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Transient;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDateTime;
import java.util.List;

@Node
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;
    String content;
    LocalDateTime creationDate;
    @JsonIgnoreProperties("wasCommented")
    @Relationship(type = "COMMENTED", direction = Relationship.Direction.INCOMING)
    List<Post> wasCommented;
    @Transient
    @JsonInclude
    String author;

    public Post(String content, LocalDateTime creationDate) {
        this.content = content;
        this.creationDate = creationDate;
    }

    @Override
    public String toString() {
        return "Post{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", creationDate=" + creationDate +
                ", wasCommented=" + wasCommented.stream().map(Post::getId).toList() +
                '}';
    }
}
