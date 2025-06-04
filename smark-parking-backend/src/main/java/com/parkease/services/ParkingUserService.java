package com.parkease.services;

import java.util.List;

import com.parkease.beans.ParkingUser;
import com.parkease.beans.Vehicle;


public interface ParkingUserService {
	
	public List<ParkingUser> getAllParkingUsers();

	public List<Vehicle> addNewVehicle(Vehicle vehicle, String email);

}
