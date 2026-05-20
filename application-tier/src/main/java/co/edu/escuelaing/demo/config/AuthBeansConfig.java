package co.edu.escuelaing.demo.config;

import co.edu.escuelaing.demo.auth.AuthService;
import co.edu.escuelaing.demo.auth.TokenService;
import co.edu.escuelaing.demo.auth.UserStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.time.Duration;

@Configuration
public class AuthBeansConfig {
    @Bean
    public UserStore userStore() {
        return new UserStore();
    }

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    public TokenService tokenService(Clock clock) {
        return new TokenService(clock, Duration.ofHours(8));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthService authService(UserStore userStore, PasswordEncoder passwordEncoder, TokenService tokenService) {
        return new AuthService(userStore, passwordEncoder, tokenService);
    }
}

