package com.parkease.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingSlot;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParkingSpaceDto {
	 private String address;
	    private double latitude;
	    private double longitude;
	    private double distance;
	    private long spaceIdd;
		private String lotName;
		private int totalSlots;
		private int numberOfFloors;
		private double pricingPerHour;
		 
		
		private List<ParkingSlot> parkingSlot;
	    

	    public ParkingSpaceDto(String address, double latitude, double longitude, double distance) {
	        this.address = address;
	        this.latitude = latitude;
	        this.longitude = longitude;
	        this.distance = distance;
	        
	    }
	    

}
