import React, { Suspense, lazy, useEffect, useState } from 'react';
import MainLoader from '../Loaders/MainLoader';
const NavbarSection =lazy(()=>import('../Sections/NavbarSection'))    
const HomeSection =lazy(()=>import('../Sections/HomeSection'))    
const SocialAccountSection =lazy(()=>import('../Sections/SocialAccountSection'))    
const AboutSection =lazy(()=>import('../Sections/AboutSection'))    
const EducationSection =lazy(()=>import('../Sections/EducationSection'))    
const SkillsSection =lazy(()=>import('../Sections/SkillsSection'))    
const CertificateSection =lazy(()=>import('../Sections/CertificateSection'))    
const ProjectSection =lazy(()=>import('../Sections/ProjectSection'))    
const ContactSection =lazy(()=>import('../Sections/ContactSection'))    
const FooterSection =lazy(()=>import('../Sections/FooterSection'))    



function PortfolioPage(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <Suspense  fallback={<MainLoader/>}>
        {loading ? (
                <MainLoader />
            ) : (
                <div className='w-full'>
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
            )}        </Suspense>
   
        
        </>
    );
}

export default PortfolioPage;