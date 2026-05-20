package com.tdse.post.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class PostDto {
    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String displayName;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    public PostDto() {}
    
    public PostDto(Long id, String content, Long userId, String username, String displayName, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.createdAt = createdAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
