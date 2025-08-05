package com.briseware.mantra.util;

import com.briseware.mantra.exception.ExceptionResponse;
import com.briseware.mantra.model.User;
import com.briseware.mantra.model.UserRole;
import com.briseware.mantra.repository.UserRepository;
import com.briseware.mantra.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Cache<String, String> trialUserCache;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = recoverToken(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String login = tokenService.validateToken(token);
        if (login == null || login.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        User user = userRepository.findByLogin(login);
        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (user.getRole() == UserRole.TRIAL &&
                trialUserCache.getIfPresent(user.getLogin()) == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            ExceptionResponse error = new ExceptionResponse(
                    new Date(),
                    "Trial expired!",
                    "Trial period ended"
            );

            ObjectMapper mapper = new ObjectMapper();
            response.getWriter().write(mapper.writeValueAsString(error));
            return;
        }

        var authentication = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }


    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}
