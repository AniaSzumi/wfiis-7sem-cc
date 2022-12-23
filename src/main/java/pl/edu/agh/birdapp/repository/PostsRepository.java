package pl.edu.agh.birdapp.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import pl.edu.agh.birdapp.model.Post;

public interface PostsRepository extends Neo4jRepository<Post, String> {
    @Query("MATCH (p:Post {id: $postId})<-[:CREATED]-(u:User) RETURN u.userName")
    String getCreatorName(String postId);
}
