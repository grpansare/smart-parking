package com.parkease.beans;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@Inheritance(strategy = InheritanceType.JOINED) // Creates separate tables for child classes
@Table(name = "users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;
	
	
	private String fullname;
	
	@Column(unique=true,nullable=false)
	private String email;
	
	
	private String username;
	
	@Column(nullable=false)
	private String password;
	
	private String contactno;
	
	
	 private String roles;
	 
	 private String profileImage;
	 
	 
	 
	
	

	

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	
    
	public User(Long userId, String fullname, String email, String username, String password, String contactno,
			String roles, String profileImage) {
		super();
		this.userId = userId;
		this.fullname = fullname;
		this.email = email;
		this.username = username;
		this.password = password;
		this.contactno = contactno;
		this.roles = roles;
		this.profileImage = profileImage;
	}



	public String getProfileImage() {
		return profileImage;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
    
	

	



	

	public String getContactno() {
		return contactno;
	}

	public void setContactno(String contactno) {
		this.contactno = contactno;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	

	public Long getUserId() {
		return userId;
	}



	public void setUserId(Long userId) {
		this.userId = userId;
	}



	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}



	@Override
	public String toString() {
		return "User [userId=" + userId + ", fullname=" + fullname + ", email=" + email + ", username=" + username
				+ ", password=" + password + ", contactno=" + contactno + ", roles=" + roles + ", profileImage="
				+ profileImage + "]";
	}
	
	
	
	

}
