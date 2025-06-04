package com.parkease.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private String generatedOtp;

    public String generateOtp() {
        Random random = new Random();
        generatedOtp = String.format("%06d", random.nextInt(1000000));
        return generatedOtp;
    }

    public void sendOtp( String userName,String toEmail) throws MessagingException {
        String otp = generateOtp();
        String subject = "🔐 Your OTP Code - ParkEase Verification";

        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="text-align: center; color: #4CAF50;">Welcome to ParkEase, %s!</h2>
                <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 15px 25px; background-color: #4CAF50; color: white; font-size: 24px; border-radius: 5px;">%s</span>
                </div>
                <p style="font-size: 14px; color: #555;">Please use this OTP to complete your verification process. It is valid for <strong>10 minutes</strong>.</p>
                <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
                <p style="text-align: center; margin-top: 30px; color: #999;">— ParkEase Team 🚗</p>
            </div>
            """.formatted(userName, otp);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true for HTML

        mailSender.send(message);
    }
    public boolean validateOtp(String otp) {
        return otp.equals(generatedOtp);
    }
}

