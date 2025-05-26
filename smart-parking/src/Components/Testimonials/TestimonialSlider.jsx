import React from 'react';
import Slider from 'react-slick';
import { FaStar, FaUserCircle } from 'react-icons/fa'; // React Icons

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './TestimonialSlider.css';

const TestimonialsSlider = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Mehta',
      text: 'ParkEase has made my daily commute so much easier! No more searching for parking spots. The app is user-friendly and saves me a lot of time.',
      profileImageUrl: 'https://example.com/rahul-profile.jpg',
    },
    {
      id: 2,
      name: 'Sophia Patel',
      text: 'Booking a parking slot in advance is a game-changer! ParkEase ensures I always have a spot near my workplace. Highly recommended!',
      profileImageUrl: 'https://example.com/sophia-profile.jpg',
    },
    {
      id: 3,
      name: 'Amit Kumar',
      text: 'I love how ParkEase integrates Google Maps to show available slots. It’s fast, secure, and super convenient!',
      profileImageUrl: 'https://example.com/amit-profile.jpg',
    },
    {
      id: 4,
      name: 'Priya Sharma',
      text: 'Secure online payments make the experience hassle-free. No need to carry cash for parking anymore!',
      profileImageUrl: 'https://example.com/priya-profile.jpg',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      text: 'Real-time slot availability helps me avoid unnecessary driving around. ParkEase has truly improved my city driving experience!',
      profileImageUrl: 'https://example.com/vikram-profile.jpg',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024, // For medium screens (1024px and below)
        settings: {
          slidesToShow: 2, // Show 2 slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For small screens (768px and below)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="testimonials">
      <h1 className="text-center text-2xl font-mono my-6">
        What Our Users Say About ParkEase
      </h1>
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="testimonial-slide mx-auto max-w-xl sm:w-3/4 md:w-1/2 mt-5 rounded-md  shadow-lg "
          >
            <div className="testimonial-content">
              {/* Rating Section */}
              <div className="mb-4 flex space-x-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    <FaStar className="h-6 w-6 text-yellow-500" />
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <div className="testimonial-text pt-2">
                <blockquote>
                  <p className="text-lg text-gray-800">{testimonial.text}</p>
                </blockquote>
              </div>

              {/* Author Section */}
              <div className="mt-8 border-t border-gray-300 pt-4">
                <div className="flex items-center">
                  <FaUserCircle className="text-gray-500 text-3xl" />
                  <div className="ml-3 min-w-0">
                    <p className="truncate text-base font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="truncate text-base text-gray-500">
                      Verified ParkEase User
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsSlider;
