package com.parkease.dtos;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.parkease.beans.ParkingSlot;
import com.parkease.beans.ParkingUser;
import com.parkease.beans.User;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class BookingResponse {
	 private Long id;
	    private User parkingUser;;
	 
	    private String parkingLotName;
	    
	    private double amount;
	    
	    private String carNumber;
	   
	    
	    private ZonedDateTime arrivalTime;

	   
	    private ZonedDateTime departureTime;
	    
	    private String bookingStatus;
	    private String address;

	   
	    
	   
	    private long slotId;
}
