package com.parkease.beans;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "parking_users")
public class ParkingUser extends User {
	
	private String vehicleNumber;
	private String vehicleType;

	
	@OneToMany(mappedBy = "parkingUser", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
    private List<Vehicle> vehicles;
	

    public ParkingUser(String vehicleNumber, String vehicleType, List<Booking> parkingHistory) {
		super();
		this.vehicleNumber = vehicleNumber;
		this.vehicleType = vehicleType;
		
	}


	public List<Vehicle> getVehicles() {
		return vehicles;
	}


	public void setVehicles(List<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}


	public ParkingUser(String vehicleNumber, String vehicleType, List<Booking> parkingHistory, List<Vehicle> vehicles) {
		super();
		this.vehicleNumber = vehicleNumber;
		this.vehicleType = vehicleType;
	
		this.vehicles = vehicles;
	}


	public ParkingUser() {
		// TODO Auto-generated constructor stub
	}


	public String getVehicleNumber() {
		return vehicleNumber;
	}

	public void setVehicleNumber(String vehicleNumber) {
		this.vehicleNumber = vehicleNumber;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
	}




}
