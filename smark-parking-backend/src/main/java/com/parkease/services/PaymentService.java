



package com.parkease.services;

import com.parkease.beans.PaymentOrder;
import com.parkease.dao.PaymentOrderRepository;
import com.parkease.dtos.CreateOrderRequest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

   

    //stripe -API
    //-> productName , amount , quantity , currency
    //-> return sessionId and url
   @Autowired
   PaymentOrderRepository orderRepository;

	 public void savePayment(PaymentOrder payment) {
		  LocalDate createdDate = LocalDate.now();
		  System.out.println(createdDate+"==================================================================================================================");
		  payment.setDate(createdDate);
	        orderRepository.save(payment);
	    }

	public List<PaymentOrder> getPayments(String lotName) {
		 
		List<PaymentOrder> payments= orderRepository.findByLotName(lotName);
		return payments;
		
	}

	public List<PaymentOrder> getUserPayments(String email) {
		
		List<PaymentOrder> userPayments=	orderRepository.findByCustomerEmail(email);
		// TODO Auto-generated method stub
		return userPayments;
	}
    

}