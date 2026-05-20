package com.tdse.post.controller;

import com.tdse.post.dto.CreatePostRequest;
import com.tdse.post.dto.PostDto;
import com.tdse.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    private final PostService postService;
    
    public PostController(PostService postService) {
        this.postService = postService;
    }
    
    @GetMapping
    @Operation(
        summary = "Get all posts (public stream)",
        description = "Retrieve all posts in the public stream, ordered by creation date (newest first)"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the public stream",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PostDto.class)
            )
        )
    })
    public ResponseEntity<List<PostDto>> getPublicStream() {
        List<PostDto> posts = postService.getPublicStream();
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping
    @Operation(
        summary = "Create a new post",
        description = "Create a new post with content up to 140 characters",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Post created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PostDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input or content exceeds 140 characters"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - valid JWT token required"
        )
    })
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        
        String auth0Id = jwt.getSubject();
        PostDto createdPost = postService.createPost(request, auth0Id);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get a specific post by ID",
        description = "Retrieve a specific post by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the post",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PostDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Post not found"
        )
    })
    public ResponseEntity<PostDto> getPostById(
            @Parameter(description = "ID of the post to retrieve") 
            @PathVariable Long id) {
        
        return postService.findPostById(id)
                .map(post -> ResponseEntity.ok(post))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete a post",
        description = "Delete a post (only the author can delete their own posts)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Post deleted successfully"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - valid JWT token required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - you can only delete your own posts"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Post not found"
        )
    })
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "ID of the post to delete") 
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        
        String auth0Id = jwt.getSubject();
        postService.deletePost(id, auth0Id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}")
    @Operation(
        summary = "Get posts by user ID",
        description = "Retrieve all posts created by a specific user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved user posts",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PostDto.class)
            )
        )
    })
    public ResponseEntity<List<PostDto>> getPostsByUserId(
            @Parameter(description = "ID of the user") 
            @PathVariable Long userId) {
        
        List<PostDto> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
}
