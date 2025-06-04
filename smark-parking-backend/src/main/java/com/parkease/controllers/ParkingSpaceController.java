package com.parkease.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingSpace;
import com.parkease.dao.ParkingSpaceRepo;
import com.parkease.dtos.ParkingSpaceDto;
import com.parkease.services.ParkingSpaceService;
@RestController	
@RequestMapping("parkingspaces")
public class ParkingSpaceController {
	
	@Autowired
	public ParkingSpaceService parkingSpaceService;
	@Autowired
	public ParkingSpaceRepo parkingSpaceRepo;
	
	@GetMapping("/{location}")
	public ResponseEntity<?> getParkingSpaces(@PathVariable String location){
		List<ParkingSpace> spaces=parkingSpaceService.getByAddress(location);
		return new ResponseEntity(spaces,HttpStatus.OK);
	}
 
	
	@PutMapping("/bookparking")
	public ResponseEntity<?> bookParking(
	        @RequestParam(required = false) Long slotNumber, // Optional
	        @RequestBody Map<String, Long> request
	) {
	    try {
	        long spaceId = request.get("spaceId");

	        if (slotNumber == null) {
	            // Call method to book a random slot
	           int id= (int) parkingSpaceService.bookRandomSlot(spaceId);
	           System.out.println(id);
	            return ResponseEntity.ok().body(id);
	        } else {
	            // Call method to book a specific slot
	            parkingSpaceService.bookParking(slotNumber, spaceId);
	            return ResponseEntity.ok().body( slotNumber);
	        }
	    } catch (RuntimeException e) {
	        System.out.println(e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	    }
	}

	
	
	@PutMapping("/cancelbooking/{selectedSlot}")
	public ResponseEntity<?> cancelbooking(
	        @PathVariable Long selectedSlot, // Optional
	        @RequestBody Map<String,Long> request
	) {
	    try {
	        long spaceId = request.get("spaceId");;

	            // Call method to book a specific slot
	            parkingSpaceService.cancelBooking(selectedSlot, spaceId);
	            return ResponseEntity.ok().body( selectedSlot);
	        
	    } catch (RuntimeException e) {
	        System.out.println(e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	    }
	}
	
	  @GetMapping("/nearby")
	    public List<ParkingSpaceDto> getNearbyParking(@RequestParam double lat, @RequestParam double lon) {
	       
		  List<ParkingSpaceDto> spaces=parkingSpaceService.findNearbyParking(lat, lon);
		  
		  System.out.println("=======================================================parkingspaces");
		  System.out.println("near"+spaces);
		  
		  return spaces;
	    }
	  @GetMapping("/getAllParkingSpaces")
	  public ResponseEntity<List<ParkingSpace>> getAll(){
		  List<ParkingSpace>spaces= parkingSpaceService.getAllParkingSpaces();
		  return ResponseEntity.ok(spaces);
	  }
	  
	  @PutMapping("/update/{id}")
	    public ResponseEntity<?> updateParkingSpace(
	            @PathVariable Long id,
	            @RequestParam Long userId,
	            @RequestBody ParkingSpace updatedDetails) {
	        
	        ParkingSpace updated = parkingSpaceService.updateParkingSpace(id, userId, updatedDetails);
	        return ResponseEntity.ok(updated);
	    }
	  @PutMapping("/updatepriceandtime/{lotName}")
	    public ResponseEntity<?> updatePricingPerHour(
	            @PathVariable String lotName,
	            @RequestParam LocalTime availableFrom,
	            @RequestParam LocalTime availableTo,
	            @RequestParam Double pricingPerHour
	         ) {
	        
	        ParkingSpace updated = parkingSpaceService.updatePricingAndTime(lotName,availableFrom,availableTo,pricingPerHour);
	        if(updated == null) {
	        	return new ResponseEntity("Parking Space Not Found",HttpStatus.NOT_FOUND);
	        }
	        return ResponseEntity.ok(updated);
	    }
	  
	  
	  @PutMapping("/updateimage")
	  public ResponseEntity<?> updateImage(@RequestParam MultipartFile file,@RequestParam String lotName) throws IOException{
		  ParkingSpace parkingSpace=parkingSpaceRepo.findByLotName(lotName);
		   if (parkingSpace==null) {
		        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("space not found");
		    }
		    String uploadDir = "uploads/ParkingOwner_Images";
	        Path uploadPath = Paths.get(uploadDir);

	        // Create directories if they do not exist
	        if (!Files.exists(uploadPath)) {
	            Files.createDirectories(uploadPath);
	        }

		    // Save the file
	        String fileName = file.getOriginalFilename();
	        Path filePath = uploadPath.resolve(fileName);
	        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

	   
		    parkingSpace.setParkingSpaceImage(filePath.toString());
		    parkingSpaceRepo.save(parkingSpace);
	

		    return ResponseEntity.ok("Image uploaded successfully");
		  
	  }
	  
	  
	  
}
