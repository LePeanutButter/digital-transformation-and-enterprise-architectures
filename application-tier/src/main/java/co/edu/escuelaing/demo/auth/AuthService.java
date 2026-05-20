package co.edu.escuelaing.demo.auth;

import org.springframework.security.crypto.password.PasswordEncoder;

public class AuthService {
    private final UserStore userStore;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UserStore userStore, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userStore = userStore;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public void register(String username, String password) {
        if (userStore.exists(username)) {
            throw new IllegalArgumentException("El usuario ya existe");
        }
        userStore.put(username, passwordEncoder.encode(password));
    }

    public String login(String username, String password) {
        String hash = userStore.getPasswordHash(username)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
        if (!passwordEncoder.matches(password, hash)) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
        return tokenService.issueToken(username);
    }
}

