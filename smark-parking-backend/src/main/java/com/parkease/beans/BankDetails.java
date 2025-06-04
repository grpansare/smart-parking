package com.parkease.beans;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="bank_details")
public class BankDetails {
	@Id
	private long accountNumber;
	private String accountHolderName;
	private String bankName;
	private String ifscCode;
	

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "bank_details_id")
	private ParkingOwner  parkingOwner;
}
