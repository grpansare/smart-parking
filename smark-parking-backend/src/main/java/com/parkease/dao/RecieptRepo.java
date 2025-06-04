package com.parkease.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.beans.Reciept;
@Repository
public interface RecieptRepo extends JpaRepository<Reciept, Long>{

}
