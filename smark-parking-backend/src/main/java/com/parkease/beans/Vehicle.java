package com.parkease.beans;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Vehicles")
public class Vehicle {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long vehicleId;
	private String carMake;
	private String model;
	private String licencePlate;
	private String color;
	@ManyToOne
	 @JsonBackReference
	 @JoinColumn(name = "parkinguserid")
	public ParkingUser parkingUser;

}
