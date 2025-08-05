package com.briseware.mantra.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.briseware.mantra.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user, boolean isMobile) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var jwtBuilder = JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(user.getLogin());

            if (!isMobile) {
                jwtBuilder.withExpiresAt(generateExpirationTime());
            }

            return jwtBuilder.sign(algorithm);
        } catch (JWTCreationException ex) {
            throw new RuntimeException("Could not generate token", ex);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException ex) {
            return "";
        }
    }

    private Instant generateExpirationTime() {
        return Instant.now().plusSeconds(7200);
    }
}
