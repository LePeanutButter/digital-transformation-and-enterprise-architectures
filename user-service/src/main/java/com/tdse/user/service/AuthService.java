package com.tdse.user.service;

import com.tdse.user.dto.UserDto;
import com.tdse.user.model.User;
import com.tdse.user.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<UserDto> getAuthenticatedUser(Jwt jwt) {
        String auth0Id = jwt.getSubject();
        return userRepository.findByAuth0Id(auth0Id)
                .map(this::convertToDto);
    }
    
    public UserDto getOrCreateAuthenticatedUser(Jwt jwt) {
        String auth0Id = jwt.getSubject();
        String email = jwt.getClaim("email");
        String username = jwt.getClaim("nickname");
        String displayName = jwt.getClaim("name");
        String picture = jwt.getClaim("picture");
        
        Optional<User> existingUser = userRepository.findByAuth0Id(auth0Id);
        
        if (existingUser.isPresent()) {
            return convertToDto(existingUser.get());
        }
        
        User newUser = new User();
        newUser.setAuth0Id(auth0Id);
        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setDisplayName(displayName != null ? displayName : username);
        newUser.setPicture(picture);
        
        User savedUser = userRepository.save(newUser);
        return convertToDto(savedUser);
    }
    
    public boolean isPostOwner(Long postUserId, String auth0Id) {
        Optional<User> user = userRepository.findByAuth0Id(auth0Id);
        return user.isPresent() && user.get().getId().equals(postUserId);
    }
    
    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getAuth0Id(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getPicture(),
                user.getCreatedAt()
        );
    }
}
