package com.example.MainFolder.Repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.MainFolder.Entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUsername(String username);
    List<UserEntity> findByRole(String role);
    Optional<UserEntity> findByResetToken(String resetToken);
}