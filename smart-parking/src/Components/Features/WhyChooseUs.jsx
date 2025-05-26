import React from "react";
import { FaClock, FaCheckCircle, FaLock, FaHeadset } from "react-icons/fa"; // Importing icons
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaClock className="feature-icon" />,
      title: "Real-Time Availability",
      description: "Check available parking slots in real-time, ensuring you never waste time looking for a spot.",
    },
    {
      icon: <FaCheckCircle className="feature-icon" />,
      title: "Seamless Booking",
      description: "Book a parking spot within minutes through our simple and user-friendly interface.",
    },
    {
      icon: <FaLock className="feature-icon" />,
      title: "Secure Payment",
      description: "Make payments securely with multiple payment options available.",
    },
    {
      icon: <FaHeadset className="feature-icon" />,
      title: "24/7 Support",
      description: "Our support team is available around the clock to assist you with any issues or concerns.",
    },
  ];

  return (
    <section id="about" className="features border">
    <h2 className="section-title text-3xl text-center mb-7 font-semibold">Why Choose Us?</h2>
    <div className="features-grid flex flex-wrap justify-center gap-6">
      {features.map((feature, index) => (
        <div key={index} className="feature-card text-center p-4 border rounded-lg shadow-md">
          {feature.icon}
          <h3 className="feature-title text-lg font-semibold mt-2">{feature.title}</h3>
          <p className="feature-description text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
  
  );
};

export default WhyChooseUs;
