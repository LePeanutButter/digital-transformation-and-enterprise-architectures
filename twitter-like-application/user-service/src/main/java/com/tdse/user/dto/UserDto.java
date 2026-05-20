package com.tdse.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    @JsonProperty("auth0_id")
    private String auth0Id;
    private String displayName;
    private String picture;
    private LocalDateTime createdAt;
    
    public UserDto() {}
    
    public UserDto(Long id, String username, String email, String auth0Id, String displayName, String picture, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.auth0Id = auth0Id;
        this.displayName = displayName;
        this.picture = picture;
        this.createdAt = createdAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAuth0Id() {
        return auth0Id;
    }
    
    public void setAuth0Id(String auth0Id) {
        this.auth0Id = auth0Id;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getPicture() {
        return picture;
    }
    
    public void setPicture(String picture) {
        this.picture = picture;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
