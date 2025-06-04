package com.parkease.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingUser;
import com.parkease.beans.User;
import com.parkease.security.AuthRequest;
import com.parkease.services.ParkingOwnerService;
import com.parkease.services.ParkingUserService;
import com.parkease.services.UserInfoService;

@RestController
@RequestMapping("admin")
public class AdminController {
	
	
	@Autowired
	UserInfoService userInfoService;
	
	@Autowired
	ParkingUserService parkingUserService;
	
	@Autowired
	ParkingOwnerService parkingOwnerService;
	
	  @Value("${admin-username}")
	    private String username;

	    @Value("${admin-password}")
	    private String password;
	
	@GetMapping("/allusers")
	public List<User> getAllUsers(){
		return userInfoService.getAllUsers();
	}
	
	@PostMapping("/login") 
	public ResponseEntity<?> adminLogin(@RequestBody AuthRequest authRequest){
		System.out.println(authRequest.getUsername()+""+authRequest.getPassword());
		System.out.println(username+" "+password);
		if(authRequest.getUsername().equals(username) && authRequest.getPassword().equals(password)) {
			return new ResponseEntity<>("login successful",HttpStatus.OK);
		}
		return new ResponseEntity<>("login failed",HttpStatus.BAD_REQUEST);
	}
	
	@GetMapping("/getParkingUsers")
	public ResponseEntity<?> getParkingUsers(){
		List<ParkingUser> parkingUsers=parkingUserService.getAllParkingUsers();
		if(parkingUsers.isEmpty()) {
			return new ResponseEntity<>("Not parking users available",HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(parkingUsers,HttpStatus.OK);
	}
	@GetMapping("/getParkingOwners")
	public ResponseEntity<?> getParkingOwners(){
		try {
		List<ParkingOwner> parkingOwners=parkingOwnerService.getAllParkingOwners();
		if(parkingOwners.isEmpty()) {
			return new ResponseEntity<>("Not parking users available",HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(parkingOwners,HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>("Not parking users available",HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/{id}/accept")
	public ResponseEntity<?> accpetRequests(@PathVariable long id){
		try {
			boolean accepted=parkingOwnerService.acceptOwnerRequest(id);
			if(accepted) {
				return new ResponseEntity<>("accepted",HttpStatus.OK);			}
			return new ResponseEntity<>("",HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>("Not accepted",HttpStatus.NOT_FOUND);
			}
	}
	@PostMapping("/{id}/reject")
	public ResponseEntity<?> rejectRequests(@PathVariable long id){
		try {
			boolean rejected=parkingOwnerService.acceptOwnerRequest(id);
			if(rejected) {
				return new ResponseEntity<>("rejected",HttpStatus.OK);			}
			return new ResponseEntity<>("",HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>("Not rejected",HttpStatus.NOT_FOUND);
			}
	}

}
