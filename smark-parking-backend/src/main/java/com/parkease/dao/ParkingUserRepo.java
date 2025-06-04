package com.parkease.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parkease.beans.ParkingUser;

public interface ParkingUserRepo extends JpaRepository<ParkingUser, Long> {
    Optional<ParkingUser> findByEmail(String email);
}

