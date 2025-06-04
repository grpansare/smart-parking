package com.parkease.dao;

import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.parkease.beans.ParkingUser;
import com.parkease.beans.User;
@Primary
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsernameAndPassword(String username, String password);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
