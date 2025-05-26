import { FaCheckCircle } from "react-icons/fa";
import './About.css'

const About = () => {
  return (
    <section className="w-full  py-10 px-3   " id="about">
      <div className="flex flex-col md:flex-row items-center md:space-x-1 space-y-5 md:space-y-0">
        
        {/* Image Section */}
        <div className=" w-full flex justify-center  md:w-1/2">
          <img
            className="about-img object-cover w-full rounded-lg shadow-lg"
            src="about_image2.jpg"
            alt="Smart Parking System"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2  p-4">
          <h2 className="text-blue-600 text-2xl font-semibold tracking-wider">About ParkEase</h2>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide mt-2">
            Smart & Hassle-Free Parking
          </h1>
          <p className="text-gray-700 mt-4">
            Our <b>Smart Car Parking System</b> helps you easily find, book, and manage  parking spots in <br/> real-time. 
            With an automated slot allocation system and secure payments, parking has never<br/> been easier.
          </p>

          {/* Features List */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-gray-800">
            {[
              "Real-Time Slot Availability",
              "Automated Slot Booking",
              "Secure Online Payments",
              "Google Maps Integration",
              "Instant Notifications",
              "User-Friendly Interface",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <p className="font-bold">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a href="#" className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg mt-6 hover:bg-blue-700 transition-all">
            Learn More
          </a>

       
        </div>
      </div>
    </section>
  );
};

export default About;
