package com.briseware.mantra.repository;

import com.briseware.mantra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByLogin(String login);
    void deleteByLogin(String login);
}
