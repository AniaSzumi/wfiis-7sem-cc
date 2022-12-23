package pl.edu.agh.birdapp.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import pl.edu.agh.birdapp.model.User;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends Neo4jRepository<User, String> {
    @Query("MATCH (u1:User {userName: $userName})-[:IS_FRIENDS]->(u2:User) RETURN u2")
    List<User> findFriends(String userName);
    Optional<User> findByUserName(String userName);
}
