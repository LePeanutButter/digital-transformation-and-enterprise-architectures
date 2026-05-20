package co.edu.escuelaing.demo.auth;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class TokenService {
    private record TokenEntry(String username, Instant expiresAt) {}

    private final ConcurrentHashMap<String, TokenEntry> tokens = new ConcurrentHashMap<>();
    private final Clock clock;
    private final Duration ttl;

    public TokenService(Clock clock, Duration ttl) {
        this.clock = clock;
        this.ttl = ttl;
    }

    public String issueToken(String username) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenEntry(username, clock.instant().plus(ttl)));
        return token;
    }

    public Optional<String> resolveUsername(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        TokenEntry entry = tokens.get(token);
        if (entry == null) return Optional.empty();
        if (clock.instant().isAfter(entry.expiresAt())) {
            tokens.remove(token);
            return Optional.empty();
        }
        return Optional.of(entry.username());
    }
}

