package com.parkease.beans;



import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;



@Entity
@Table(name = "booking")
@Data
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
 
    private Long parkingLotId;
    
    private double amount;
    
    private String carNumber;
    private String paymentStatus;
    private String bookingStatus;
   
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime arrivalTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime departureTime;


    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = ZonedDateTime.ofInstant(Instant.parse(arrivalTime), ZoneId.of("Asia/Kolkata"));
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = ZonedDateTime.ofInstant(Instant.parse(departureTime), ZoneId.of("Asia/Kolkata"));
    }
    
    
    @ManyToOne
    @JoinColumn(name = "slotId")
	@JsonBackReference
    private ParkingSlot parkingSlot;
    
    
}
