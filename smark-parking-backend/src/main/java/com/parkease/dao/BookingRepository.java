package com.parkease.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.Booking;
import com.parkease.beans.ParkingSpace;
import com.parkease.beans.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	List<Booking> findByParkingLotId(Long parkingLotId);
	
	List<Booking> findByUserId(Long userId);
//	  List<Booking> findByParkingSpace(ParkingSpace parkingSpace);
//	    List<Booking> findByParkingUser(User user);
}
