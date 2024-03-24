import React from 'react';

import NavbarSection from '../Sections/NavbarSection'
import HomeSection from '../Sections/HomeSection'
import SocialAccountSection from '../Sections/SocialAccountSection'
import AboutSection from '../Sections/AboutSection'
import EducationSection from '../Sections/EducationSection'
import SkillsSection from '../Sections/SkillsSection'
import CertificateSection from '../Sections/CertificateSection'
import ProjectSection from '../Sections/ProjectSection'
import ContactSection from '../Sections/ContactSection'
import FooterSection from '../Sections/FooterSection'

function PortfolioPage(props) {
    return (
        <div className=''>
              <NavbarSection/>
   <HomeSection/>
   <SocialAccountSection/>
   <AboutSection/>
   <EducationSection/>
   <SkillsSection/>
   <CertificateSection/>
   <ProjectSection/>
   <ContactSection/>
   <FooterSection/>
        </div>
    );
}

export default PortfolioPage;