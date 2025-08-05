package com.briseware.mantra.repository;

import com.briseware.mantra.model.User;
import com.briseware.mantra.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByLogin(String login);
    void deleteByLogin(String login);
    List<User> findByRole(UserRole role);
}
