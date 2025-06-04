package com.parkease.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.ParkingOwner;

@Repository
public interface ParkingOwnerRepo extends JpaRepository<ParkingOwner, Long>{
	
	public ParkingOwner findByEmail(String email);

}
