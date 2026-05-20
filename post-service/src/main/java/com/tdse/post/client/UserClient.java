package com.tdse.post.client;

import com.tdse.post.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${USER_SERVICE_URL}")
public interface UserClient {
    
    @GetMapping("/api/users/{username}")
    UserDto getUserByUsername(@PathVariable String username);
    
    @GetMapping("/api/users/internal/{auth0Id}")
    UserDto getUserByAuth0Id(@PathVariable String auth0Id);
}
