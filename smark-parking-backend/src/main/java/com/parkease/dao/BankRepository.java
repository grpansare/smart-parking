package com.parkease.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.BankDetails;
@Repository
public interface BankRepository extends JpaRepository<BankDetails, Long>{

}
