package com.parkease.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.parkease.beans.ParkingSpace;
import com.parkease.dtos.ParkingSpaceDto;

public interface ParkingSpaceService {
	public List<ParkingSpace> getByAddress(String location);


	 public void bookParking(long slotNumber, long spaceId);


	public long bookRandomSlot(long spaceId);


	public void cancelBooking(Long selectedSlot, long spaceId);


	public List<ParkingSpaceDto> findNearbyParking(double lat, double lon);


	public List<ParkingSpace> getAllParkingSpaces();

	public ParkingSpace updateParkingSpace(Long id, Long ownerId, ParkingSpace updatedDetails) ;


	public ParkingSpace updatePricingAndTime(String lotName, LocalTime availableFrom, LocalTime availableTo,
			Double pricingPerHour);
}
