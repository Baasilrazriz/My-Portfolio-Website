import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavbarSection from './Sections/NavbarSection'
import HomeSection from './Sections/HomeSection'
import SocialAccountSection from './Sections/SocialAccountSection'
import AboutSection from './Sections/AboutSection'
import EducationSection from './Sections/EducationSection'

function App() {


  return (
    <>
   <NavbarSection/>
   <HomeSection/>
   <SocialAccountSection/>
   <AboutSection/>
   <EducationSection/>
    </>
  )
}

export default App
