package com.parkease.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parkease.beans.ParkingSlot;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long>{

}
