package com.parkease.services;

import java.util.List;

import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingSpace;

public interface ParkingOwnerService {
	
	public ParkingOwner createParkignOwner(ParkingOwner parkingOwner);
	
	public List<ParkingOwner> getAllParkingOwners();

	public boolean acceptOwnerRequest(long id);
	public boolean rejectOwnerRequest(long id);

	public ParkingSpace getParkingSpace(String email);

	public ParkingOwner getProfile(String email);

}
