package com.parkease.dtos;

import java.math.BigDecimal;

public class CreateOrderRequest {
	 
	    private String name;
	    
	
	    private String email;
	    
	
	    private String phone;
	    
	    private double amount;

	  
	    public String getName() {
	        return name;
	    }

	    public void setName(String name) {
	        this.name = name;
	    }

	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }

	    public String getPhone() {
	        return phone;
	    }

	    public void setPhone(String phone) {
	        this.phone = phone;
	    }

		public double getAmount() {
			return amount;
		}

		public void setAmount(double amount) {
			this.amount = amount;
		}

		

	   
	}


	