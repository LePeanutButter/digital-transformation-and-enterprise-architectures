package com.tdse.user.repository;

import com.tdse.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByAuth0Id(String auth0Id);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    boolean existsByAuth0Id(String auth0Id);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
}
