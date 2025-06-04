package com.parkease.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.parkease.beans.BankDetails;
import com.parkease.beans.ParkingOwner;
import com.parkease.beans.ParkingSlot;
import com.parkease.beans.ParkingSpace;
import com.parkease.beans.User;
import com.parkease.dao.BankRepository;
import com.parkease.dao.ParkingOwnerRepo;
import com.parkease.dao.ParkingSpaceRepo;
import com.parkease.services.ParkingOwnerService;

@RestController
@RequestMapping("/parkingowner")
public class ParkingOwnerController {
	
	@Autowired
	ParkingOwnerService parkingOwnerService;
	
	@Autowired
	ParkingOwnerRepo ownerRepo;
	
	@Autowired
	BankRepository bankRepository;;
	
	@Autowired
	ParkingSpaceRepo parkingSpaceRepo;;
	
	@PostMapping
	public ResponseEntity<?> addPakingOwner(@RequestBody ParkingOwner owner){
		System.out.println(owner.getEmail());
		System.out.println(owner.getBankDetails());
		System.out.println(owner.getParkingSpaces());
		
	
	   ParkingOwner parkingOwner= parkingOwnerService.createParkignOwner(owner);
	   
	   if(parkingOwner != null) {
		   return ResponseEntity.ok(owner);
	   }
	   return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
	}
	@PostMapping("/{id}/upload-image")
	public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("image") MultipartFile imageFile) throws IOException {
	    Optional<ParkingOwner> optionalOwner = ownerRepo.findById(id);
	    if (optionalOwner.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Owner not found");
	    }
	    String uploadDir = "uploads/ParkingOwner_Images";
        Path uploadPath = Paths.get(uploadDir);

        // Create directories if they do not exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

	    // Save the file
        String fileName = imageFile.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        ParkingOwner owner=optionalOwner.get();
	    // Save image path to DB (optional)
	    List<ParkingSpace> spaces=owner.getParkingSpaces();
	    spaces.get(0).setParkingSpaceImage(filePath.toString());
	    owner.setParkingSpaces(spaces);
	    ownerRepo.save(owner);

	    return ResponseEntity.ok("Image uploaded successfully");
	}

	
	@GetMapping("/parkingspace/{email}")
	public ResponseEntity<?> getParkingSpace(@PathVariable String email){
		ParkingSpace parkingSpace=parkingOwnerService.getParkingSpace(email);
		return new ResponseEntity(parkingSpace,HttpStatus.OK);
	}
	@GetMapping("/{email}")
	public ResponseEntity<?> getProfile(@PathVariable String email){
		ParkingOwner parkingOwner=parkingOwnerService.getProfile(email);
		return new ResponseEntity(parkingOwner,HttpStatus.OK);
	}
	
	 @PutMapping("/{userId}/update-bank")
	    public ResponseEntity<?> updateBankDetails(@PathVariable Long userId, @RequestBody BankDetails updatedDetails) {
	        Optional<ParkingOwner> ownerOpt = ownerRepo.findById(userId);

	        if (ownerOpt.isPresent()) {
	            ParkingOwner owner = ownerOpt.get();

	            BankDetails  currentDetails = owner.getBankDetails();
	            if (currentDetails == null) {
	                currentDetails = new BankDetails();
	            }
//             
	            System.out.println("==================================");
//	            currentDetails.setAccountNumber(updatedDetails.getAccountNumber());
	            currentDetails.setBankName(updatedDetails.getBankName());
	            currentDetails.setIfscCode(updatedDetails.getIfscCode());
	        

	            bankRepository.save(currentDetails);
	            owner.setBankDetails(currentDetails);
	            ownerRepo.save(owner);

	            return ResponseEntity.ok("Bank details updated successfully!");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ParkingOwner not found");
	        }
	    }


	 
	  @PutMapping("/update/{userId}")
	  public ResponseEntity<?> updateDetails(@PathVariable long userId,@RequestBody ParkingOwner owner){
		  try {
			Optional<ParkingOwner> existingOwner=ownerRepo.findById(userId);
			  if(existingOwner.isPresent()) {
				  ParkingOwner ex=existingOwner.get();
				  ex.setFullname(owner.getFullname());
				  ex.setEmail(owner.getEmail());
				  ex.setContactno(owner.getContactno());
				  ownerRepo.save(ex);
				  return ResponseEntity.ok(ex);
				  
			  }
			  return ResponseEntity.notFound().build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.notFound().build();
		}
	  }
	  
	  
	  
	  
	  @GetMapping("/addnewslot/{id}")
	  public ResponseEntity<?> addnewSlot(@PathVariable Long id){
		  
		  ParkingSpace parkingSpace=parkingSpaceRepo.findById(id).get();
		  ParkingSlot parkingSlot=new ParkingSlot(parkingSpace.getTotalSlots()+1,true);
		  parkingSpace.setTotalSlots(parkingSpace.getTotalSlots()+1);
		  parkingSlot.setFloorNumber(parkingSpace.getNumberOfFloors());
		  parkingSlot.setParkingSpace(parkingSpace);
		  parkingSpace.getParkingSlot().add(parkingSlot);
		  parkingSpaceRepo.save(parkingSpace);
		  return new ResponseEntity("slot added",HttpStatus.OK);	
		  
	  }
	

}
