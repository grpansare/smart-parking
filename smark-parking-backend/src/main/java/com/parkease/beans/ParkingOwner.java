package com.parkease.beans;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Entity
@Table(name = "parking_owner")
public class ParkingOwner extends User {
	
	
	private String status = "Pending";

	
	@OneToMany(mappedBy = "parkingowner" ,cascade=CascadeType.ALL)
	
	private List<ParkingSpace> parkingSpaces;
	
	private double TotalEarning;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "bank_details_id", referencedColumnName = "accountNumber")
	private BankDetails bankDetails;
	
	private String confirmPassword;

	@Override
	public String toString() {
		
		return "ParkingOwner [parkingSpaces=" + parkingSpaces + ", bankDetails=" + bankDetails + ", getParkingSpaces()="
				+ getParkingSpaces() + ", getBankDetails()=" + getBankDetails() + "]";
	}

	

	
    
    
    
}
