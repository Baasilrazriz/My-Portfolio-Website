import React from 'react';
import Heading from '../Components/Heading';
import CertificateCard from '../Components/Certification/CertificateCard';
import { useSelector } from 'react-redux';
 

function CertificateSection(props) {
  const certificates = useSelector((state) => state.certificate.certificates);
    return (
        <section id="Achievements" class="bg-slate-300  dark:bg-slate-950 ">
    <Heading theme="d" heading="My Achievements"/>
    <div class="w-full py-10 px-20 flex flex-wrap gap-5 justify-center h-full overflow-hidden">
{
  certificates.map((cert)=>(
    <CertificateCard image={cert.image} link={cert.link} title={cert.name} org={cert.organization}/>
  )
)
}
    </div>
  </section>
    );
}

export default CertificateSection;