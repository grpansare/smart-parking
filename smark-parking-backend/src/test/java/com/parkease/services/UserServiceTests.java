package com.parkease.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.parkease.dao.UserRepository;
@SpringBootTest
public class UserServiceTests {
	
	@Autowired
	UserRepository userRepository;
	
//	@Disabled
	@Test
//	@ParameterizedTest
//	@ValueSource(strings= {
//			"ram",
//			"shyam",
//			"vipul"
//	})

	public void addTest() {
		
		assertEquals(4, 2+2);
//		assertNotNull( userRepository.findByEmail("grpansare2002@gmail.com"));
	}
	
	@ParameterizedTest
	@CsvSource({
		"1,1,2",
		"2,10,12",
		"3,3,9"
	})
	@Disabled
	public void test(int a,int b,int expected) {
		assertEquals(expected, a+b);
	}

}
