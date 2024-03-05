import React from 'react';
import {useSelector } from 'react-redux';
import Heading from '../Components/Heading';
import SkillsCard from '../Components/Skills/SkillsCard';
function SkillsSection(props) {
    const skills = useSelector((state) => state.skills.skills);
    return (
        <section id="skills" className="bg-slate-800">
        <div className="p-5 ">
    
    <Heading theme="l"  heading="My Skills"/>
        </div>
    
        <div className="h-auto w-full md:px-36 pb-24">
    
          <div className="py-5 w-full h-full flex flex-wrap gap-5 justify-center  ">
    {skills.map((item) => (
        <SkillsCard id={item.name} image={item.image}/>
      ))
    }
          </div>
        </div>
    
    
      </section>
    );
}

export default SkillsSection;