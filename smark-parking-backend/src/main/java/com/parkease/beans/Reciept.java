package com.parkease.beans;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table
public class Reciept {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recieptId;
    private String customerName;
    @Column(columnDefinition = "TIMESTAMP")
    private ZonedDateTime arrivalTime;

    @Column(columnDefinition = "TIMESTAMP")
    private ZonedDateTime departureTime;

  
    private double amount;
    private String lotName;
    private String parkingSpotAddress;
    
    private String paymentStatus;
    
    private Long slotId;

    public String getParkingSpotAddress() {
		return parkingSpotAddress;
	}

	public void setParkingSpotAddress(String parkingSpotAddress) {
		this.parkingSpotAddress = parkingSpotAddress;
	}

	// Constructor
    public Reciept(String customerName,double amount, String lotName) {
        this.customerName = customerName;
       
        this.amount = amount;
        this.lotName = lotName;
    }

    
    
    public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public Long getReceiptId() {
		return recieptId;
	}

	public void setReceiptId(Long receiptId) {
		this.recieptId = receiptId;
	}

	public Long getSlotId() {
		return slotId;
	}

	public void setSlotId(Long slotId) {
		this.slotId = slotId;
	}

	// Getters and Setters
    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

  

    public ZonedDateTime getArrivalTime() {
		return arrivalTime;
	}
    
	public Long getRecieptId() {
		return recieptId;
	}

	public void setRecieptId(Long recieptId) {
		this.recieptId = recieptId;
	}

	public void setArrivalTime(ZonedDateTime arrivalTime) {
		this.arrivalTime = arrivalTime;
	}

	public ZonedDateTime getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(ZonedDateTime departureTime) {
		this.departureTime = departureTime;
	}

	public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getLotName() {
        return lotName;
    }

    public void setLotName(String lotName) {
        this.lotName = lotName;
    }

    @Override
    public String toString() {
        return "Reciept{" +
                "customerName='" + customerName + '\'' +
                ", arrivalTime='" + arrivalTime + '\'' +
                ", departureTime='" + departureTime + '\'' +
                ", amount=" + amount +
                ", lotName='" + lotName + '\'' +
                '}';
    }
}

