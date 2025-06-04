package com.parkease.beans;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
public class PaymentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String paymentId;
    private String orderId;
    private String signature;
    private double amount;
    private String currency;
    private String customerEmail;
    private String customerName;
    private String status;
    public String lotName;

  
    public LocalDate date;
}



