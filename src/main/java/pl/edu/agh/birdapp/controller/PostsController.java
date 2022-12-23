package pl.edu.agh.birdapp.controller;

import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.birdapp.dto.PostRequest;
import pl.edu.agh.birdapp.dto.PostsResponse;
import pl.edu.agh.birdapp.model.Post;
import pl.edu.agh.birdapp.model.User;
import pl.edu.agh.birdapp.repository.PostsRepository;
import pl.edu.agh.birdapp.repository.UsersRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/posts")
@AllArgsConstructor
public class PostsController {
    private final PostsRepository postsRepository;
    private final UsersRepository usersRepository;

    @PostMapping()
    public ResponseEntity<Void> createPost(@RequestBody PostRequest postRequest) {
        if (postRequest != null) {
            Optional<User> optionalUser = usersRepository.findByUserName(postRequest.getUserName());
            if (optionalUser.isPresent()) {
                Post post = new Post(postRequest.getContent(), LocalDateTime.now());
                post = postsRepository.save(post);
                User user = optionalUser.get();
                val posts = user.getPosts();
                posts.add(post);
                user.setPosts(posts);
                usersRepository.save(user);
                Optional<Post> optionalCommented = postsRepository.findById(postRequest.getCommentId());
                if (optionalCommented.isPresent()) {
                    Post commented = optionalCommented.get();
                    List<Post> wasCommented = commented.getWasCommented();
                    wasCommented.add(post);
                    commented.setWasCommented(wasCommented);
                    postsRepository.save(commented);
                }
                return ResponseEntity.ok(null);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping()
    public ResponseEntity<PostsResponse> getAllPostsForUser(@RequestParam String userName) {
        Optional<User> optionalUser = usersRepository.findByUserName(userName);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Post> posts = user.getPosts();
            posts.forEach(post -> {
                post.setAuthor(userName);
                if (post.getWasCommented() != null && !post.getWasCommented().isEmpty()) {
                    post.getWasCommented().forEach(comment -> {
                        String author = postsRepository.getCreatorName(comment.getId());
                        comment.setAuthor(author);
                    });
                }
            });
            return ResponseEntity.ok(new PostsResponse(posts));
        }
        return ResponseEntity.ok(null);
    }

    @GetMapping("/comments")
    public ResponseEntity<PostsResponse> getComments(@RequestParam String id) {
        Optional<Post> post = postsRepository.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(new PostsResponse(post.get().getWasCommented()));
        }
        return ResponseEntity.ok(null);
    }
}
