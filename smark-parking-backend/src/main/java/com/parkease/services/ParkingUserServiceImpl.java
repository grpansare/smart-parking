package com.parkease.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.parkease.beans.ParkingUser;
import com.parkease.beans.User;
import com.parkease.beans.Vehicle;
import com.parkease.dao.ParkingUserRepo;
@Service
public class ParkingUserServiceImpl implements ParkingUserService{
	
	@Autowired
	ParkingUserRepo parkingUserRepo;

	@Override
	public List<ParkingUser> getAllParkingUsers() {
		// TODO Auto-generated method stub
		return parkingUserRepo.findAll();
	}

	@Override
	public List<Vehicle> addNewVehicle(Vehicle vehicle, String email) {
		
		ParkingUser parkingUser=parkingUserRepo.findByEmail(email).get();
       List<Vehicle>vehicles= parkingUser.getVehicles();
       vehicle.setParkingUser(parkingUser);
       vehicles.add(vehicle);
      
       parkingUser.setVehicles(vehicles);
      
        parkingUserRepo.save(parkingUser);
		
		return vehicles;
		// TODO Auto-generated method stub
		
	}

}
