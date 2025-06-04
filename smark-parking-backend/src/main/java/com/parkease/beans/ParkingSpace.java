package com.parkease.beans;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
@Entity
@Table(name="parking_space")
public class ParkingSpace {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String lotName;
	private String address;
	private int totalSlots;
	private int numberOfFloors;
	
	private String parkingSpaceImage;
	
	
	private LocalTime availableFrom;
	private LocalTime availableTo;

	private double pricingPerHour;
 
	public ParkingSpace() {
		super();
		// TODO Auto-generated constructor stub
	}
	@ManyToOne()
	@JoinColumn(name = "parkingownerid")
	@JsonBackReference
	private ParkingOwner parkingowner;
	
	@OneToMany(mappedBy = "parkingSpace",cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<ParkingSlot> parkingSlot;
	

}
