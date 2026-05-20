package com.tdse.user.service;

import com.tdse.user.dto.UserDto;
import com.tdse.user.model.User;
import com.tdse.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public UserDto createUser(User user) {
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }
    
    public Optional<UserDto> findByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id)
                .map(this::convertToDto);
    }
    
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto);
    }
    
    public Optional<UserDto> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }
    
    public UserDto getOrCreateUser(String auth0Id, String email, String username, String displayName, String picture) {
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
        
        return convertToDto(userRepository.save(newUser));
    }
    
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public boolean existsByAuth0Id(String auth0Id) {
        return userRepository.existsByAuth0Id(auth0Id);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
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
    
    private User convertToEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setAuth0Id(userDto.getAuth0Id());
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setDisplayName(userDto.getDisplayName());
        user.setPicture(userDto.getPicture());
        user.setCreatedAt(userDto.getCreatedAt());
        return user;
    }
}
