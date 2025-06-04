package com.parkease.dao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.PaymentOrder;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    Optional<PaymentOrder> findByOrderId(String orderId);

	List<PaymentOrder> findByLotName(String lotName);

	List<PaymentOrder> findByCustomerEmail(String email);
}
