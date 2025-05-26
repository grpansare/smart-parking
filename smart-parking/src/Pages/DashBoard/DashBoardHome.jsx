import React from 'react'
import Hero from '../../Components/Hero/Hero'
import About from '../../Components/About/About'
import WhyChooseUs from '../../Components/Features/WhyChooseUs'
import TestimonialsSlider from '../../Components/Testimonials/TestimonialSlider'
import FeaturedParkingSpaces from '../../Components/FeaturedParkings/FeaturedParkingSpaces'

const DashBoardHome = () => {
  return (
    <div><Hero/>
     <FeaturedParkingSpaces/>
    <About/>
    <WhyChooseUs/>
    <TestimonialsSlider/></div>
  )
}

export default DashBoardHome