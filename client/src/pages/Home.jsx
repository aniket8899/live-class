import React from 'react'
import BenifitsSection from '../components/Home/BenifitsSection'
import FeaturesSection from '../components/Home/FeaturesSection'
import HeroSection from '../components/Home/HeroSection'
import CTASection from '../components/Home/CTASection'

const Home = () => {
  return (
    <div className='min-h-screen bg-white'>
        <HeroSection/>
        <FeaturesSection/>
        <BenifitsSection/>
        <CTASection/>
    </div>
  )
}

export default Home
