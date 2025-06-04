package com.parkease.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingSpace;
@Repository
public interface ParkingSpaceRepo extends JpaRepository<ParkingSpace, Long>{
	
    List<ParkingSpace> findByAddressContainingIgnoreCase(String address);

	ParkingSpace findByLotName(String lotName);
	Optional<ParkingSpace> findByIdAndParkingowner(Long id, ParkingOwner owner);





}
