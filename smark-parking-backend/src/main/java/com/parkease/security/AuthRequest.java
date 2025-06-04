package com.parkease.security;

public class AuthRequest {

    private String email;
    private String password;
    private String username;
	public String getUsername() {
		return username;
	}
	
	public AuthRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void setUsername(String username) {
		this.username = username;
	}
	public AuthRequest(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
    
    

}