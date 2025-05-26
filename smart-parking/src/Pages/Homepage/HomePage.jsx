import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Hero from '../../Components/Hero/Hero'
import About from '../../Components/About/About'
import WhyChooseUs from '../../Components/Features/WhyChooseUs'
import Footer from '../../Components/Footer/Footer'

import TestimonialsSlider from '../../Components/Testimonials/TestimonialSlider'
import FeaturedParkingSpaces from '../../Components/FeaturedParkings/FeaturedParkingSpaces'

const HomePage = () => {
  return (
    <>
  <Navbar/>
  <Hero/>
  <FeaturedParkingSpaces/>
  <About/>
  <WhyChooseUs/>
  <TestimonialsSlider/>
  <Footer/>
  </>
  )
}

export default HomePage