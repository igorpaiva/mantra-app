package com.briseware.mantra.config;

import com.briseware.mantra.service.AuthorizationService;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.RemovalCause;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {
    @Bean
    public Cache<String, String> trialUserCache(AuthorizationService authorizationService) {
        return Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.MINUTES)
                .removalListener((String key, String value, RemovalCause cause) -> {
                    if (cause == RemovalCause.EXPIRED) {
                        authorizationService.deleteUserByLogin(key);
                    }
                })
                .build();
    }
}
