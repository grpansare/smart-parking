package com.parkease;

import org.springframework.boot.SpringApplication;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;



@SpringBootApplication
@CrossOrigin(origins = "http://localhost:5173")
@EnableJpaRepositories(basePackages = "com.parkease.dao")

@EntityScan(basePackages = "com.parkease.beans")
public class ParkEaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParkEaseApplication.class, args);
	}

}
