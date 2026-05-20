package co.edu.escuelaing.demo.auth;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class UserStore {
    private final ConcurrentHashMap<String, String> usernameToPasswordHash = new ConcurrentHashMap<>();

    public boolean exists(String username) {
        return usernameToPasswordHash.containsKey(username);
    }

    public void put(String username, String passwordHash) {
        usernameToPasswordHash.put(username, passwordHash);
    }

    public Optional<String> getPasswordHash(String username) {
        return Optional.ofNullable(usernameToPasswordHash.get(username));
    }
}

