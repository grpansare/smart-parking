package com.parkease.controllers;



import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.parkease.beans.PaymentOrder;
import com.parkease.dao.PaymentOrderRepository;
import com.parkease.dtos.CreateOrderRequest;
import com.parkease.dtos.CreateOrderResponse;

import com.parkease.dtos.PaymentResponse;
import com.parkease.dtos.StripeResponse;
import com.parkease.services.PaymentService;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;

import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @Autowired
    PaymentService paymentService;
    
    @Autowired
    PaymentOrderRepository orderRepo;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody CreateOrderRequest orderRequest) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Razorpay order creation parameters
            JSONObject orderRequestParams = new JSONObject();
            orderRequestParams.put("amount", orderRequest.getAmount() * 100); // amount in paise
            orderRequestParams.put("currency", "INR");
            orderRequestParams.put("receipt", "txn_123456");
            orderRequestParams.put("payment_capture", 1);

            // Create order on Razorpay
            Order order = razorpayClient.orders.create(orderRequestParams);
            return order.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while creating order: " + e.getMessage();
        }
    }
    
    @GetMapping("getPayments")
    public List<PaymentOrder> getPayment(){
    	
    	return orderRepo.findAll();
    	
    }
    @PostMapping("/store")
    public ResponseEntity<String> storePayment(@RequestBody PaymentOrder payment) {
        paymentService.savePayment(payment);
        return ResponseEntity.ok("Payment saved successfully.");
    }
    
    
    @GetMapping("/getAllPayments/{lotName}")
    public ResponseEntity<?> getAllPayments(@PathVariable String lotName){
    	List<PaymentOrder> paymentOrders= paymentService.getPayments(lotName);
    	return  new ResponseEntity(paymentOrders,HttpStatus.OK);
    }
    @GetMapping("/getAllUserPayments/{email}")
    public ResponseEntity<?> getUserPayments(@PathVariable String email){
    	List<PaymentOrder> paymentOrders= paymentService.getUserPayments(email);
    	return  new ResponseEntity(paymentOrders,HttpStatus.OK);
    }
    

}