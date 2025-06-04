package com.parkease.dtos;


public class CreateOrderResponse {
    private String orderId;
    private String paymentSessionId;
    private String orderStatus;

    public CreateOrderResponse() {
    }

    public CreateOrderResponse(String orderId, String paymentSessionId, String orderStatus) {
        this.orderId = orderId;
        this.paymentSessionId = paymentSessionId;
        this.orderStatus = orderStatus;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPaymentSessionId() {
        return paymentSessionId;
    }

    public void setPaymentSessionId(String paymentSessionId) {
        this.paymentSessionId = paymentSessionId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}
