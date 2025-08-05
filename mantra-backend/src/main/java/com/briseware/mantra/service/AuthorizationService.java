package com.briseware.mantra.service;

import com.briseware.mantra.model.User;
import com.briseware.mantra.model.UserRole;
import com.briseware.mantra.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        return userRepository.findByLogin(login);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserByLogin(String login) {
        userRepository.deleteByLogin(login);
    }

    public List<User> findAllTrialUsers() {
        return userRepository.findByRole(UserRole.TRIAL);
    }
}
