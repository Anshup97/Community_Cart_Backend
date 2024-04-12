package com.communitycart.authservice.repository;


import com.communitycart.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<User, String> {
    public User findByEmailId(String email);
    public void deleteByEmailId(String email);
}
