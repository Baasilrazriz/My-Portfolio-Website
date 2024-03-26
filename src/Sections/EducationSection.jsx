import React from 'react';
import Heading from '../Components/Heading';
import EducationCard from '../Components/Education/EducationCard';
import {useSelector } from 'react-redux';
import EndPoints from '../Components/Education/EndPoints';
function EducationSection(props) {
    const education = useSelector((state) => state.education.educationExp);
    return (
        <section id="education" className="bg-slate-300  dark:bg-slate-950 px-5">

       <Heading theme="d" heading="My Education"/>
    
        <div>
          <div className=" p-4 mt-6 pb-40">
    
            <div className="container">
    
              <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
    
    <EndPoints position="start"/>
    {education.map((edu)=>(
        <EducationCard image={edu.image} title={edu.title} timestamp={edu.timestamp} description={edu.description} result={edu.result} resultType={edu.resultType}/>
    ))}
                
                
    
               <EndPoints position="end"/>
              </div>
    
            </div>
          </div>
        </div>
    
      </section>
    );
}

export default EducationSection;