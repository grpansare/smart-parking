package com.parkease.dtos;

public class PaymentResponse {
    private String paymentLink;
    private String status;
    private String orderId;
    
    // Constructors
    public PaymentResponse() {}
    
    public PaymentResponse(String paymentLink) {
        this.paymentLink = paymentLink;
        this.status = "CREATED";
    }
    
    // Getters and Setters
    public String getPaymentLink() {
        return paymentLink;
    }
    
    public void setPaymentLink(String paymentLink) {
        this.paymentLink = paymentLink;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}