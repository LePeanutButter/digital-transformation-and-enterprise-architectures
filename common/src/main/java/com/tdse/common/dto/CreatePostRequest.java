package com.tdse.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePostRequest {
    
    @NotBlank(message = "Content is required")
    @Size(max = 140, message = "Post content must not exceed 140 characters")
    private String content;
    
    public CreatePostRequest() {}
    
    public CreatePostRequest(String content) {
        this.content = content;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}
