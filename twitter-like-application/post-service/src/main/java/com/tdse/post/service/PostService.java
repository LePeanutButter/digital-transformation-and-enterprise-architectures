package com.tdse.post.service;

import com.tdse.post.dto.CreatePostRequest;
import com.tdse.post.dto.PostDto;
import com.tdse.post.dto.UserDto;
import com.tdse.post.client.UserClient;
import com.tdse.post.model.Post;
import com.tdse.post.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    private final UserClient userClient;
    
    public PostService(PostRepository postRepository, UserClient userClient) {
        this.postRepository = postRepository;
        this.userClient = userClient;
    }
    
    public PostDto createPost(CreatePostRequest request, String auth0Id) {
        // RESOLVED: Using Feign Client instead of direct repository access
        UserDto userDto = userClient.getUserByAuth0Id(auth0Id);
        if (userDto == null) {
            throw new RuntimeException("User not found with Auth0 ID: " + auth0Id);
        }
        
        Post post = new Post();
        post.setContent(request.getContent());
        post.setUserId(userDto.getId()); // Store only user ID, not full user object
        
        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost, userDto);
    }
    
    public List<PostDto> getPublicStream() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .map(this::convertToDtoWithUserLookup)
                .collect(Collectors.toList());
    }
    
    public List<PostDto> getPostsByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        UserDto userDto = userClient.getUserByUsername(userId.toString());
        return posts.stream()
                .map(post -> convertToDto(post, userDto))
                .collect(Collectors.toList());
    }
    
    public Optional<PostDto> findPostById(Long id) {
        return postRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public void deletePost(Long id, String auth0Id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found with ID: " + id);
        }
        
        Post post = postOptional.get();
        UserDto userDto = userClient.getUserByAuth0Id(auth0Id);
        
        if (!post.getUserId().equals(userDto.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }
        
        postRepository.delete(post);
    }
    
    public long getPostCountByUserId(Long userId) {
        return postRepository.countByUserId(userId);
    }
    
    private PostDto convertToDtoWithUserLookup(Post post) {
        UserDto userDto = userClient.getUserByUsername(post.getUserId().toString());
        return convertToDto(post, userDto);
    }
    
    private PostDto convertToDto(Post post, UserDto userDto) {
        return new PostDto(
                post.getId(),
                post.getContent(),
                post.getUserId(),
                userDto.getUsername(),
                userDto.getDisplayName(),
                post.getCreatedAt()
        );
    }
    
    private PostDto convertToDto(Post post) {
        UserDto userDto = userClient.getUserByUsername(post.getUserId().toString());
        return convertToDto(post, userDto);
    }
}
