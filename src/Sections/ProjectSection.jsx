import React, { useState } from 'react';
import Heading from '../Components/Heading';
import ProjectCard from '../Components/Projects/ProjectCard';

function ProjectSection(props) {
  const projects=[
    {
      title:"Ecommerce Web App",
      image:"",
      description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills:["React JS","Asp.net","Tailwind css","SQL","RTK"],
      type:"Web",
    },
    {
      title:"Airline Management System",
      image:"",
      description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills:["C#","SQL"],
      type:"Desktop",
    },
    {
      title:"Airline Management System",
      image:"",
      description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills:["C#","SQL"],
      type:"Desktop",
    },
    {
      title:"mob hlo",
      image:"",
      description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills:["React Native"],
      type:"Mobile",
    },
    {
      title:"Ecommerce Web App",
      image:"",
      description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills:["React JS","Asp.net","Tailwind css","SQL","RTK"],
      type:"Web",
    },
  ]
  const [toggleProject,setToggleProject]=useState(false)
  const handleMoreProjects=()=>{
    setToggleProject(!toggleProject)
  }

    return (
        <section id="proj">

      <Heading theme="l" heading="My Projects"/>
        <div className="pt-14 pb-28 px-10 md:px-28 bg-slate-800  ">
    
    
          <div id="projects" className=" text-white section-p1 bg-slate-950 border-2 rounded-2xl">
    
            <div id="searchbar"
              className="px-4 overflow-hidden flex w-full h-16 justify-between items-center  bg-gray-400 text-black  border-2 rounded-tl-2xl rounded-tr-2xl">
    
              <div className="hidden md:block">
                <ul className="md:flex md:flex-row md:justify-center  gap-5 font-semibold hidden  ">
                  <li
                    className=" border-gray-600 text-gray-300 hover:bg-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-700 hover:scale-95 border-2  rounded-full cursor-pointer text-base p-1  font-bold  active:after:border-2 active:after:border-white active:after:rounded-3xl h-9   w-28 text-center  ">
                    All projects</li>
                  <li
                    className=" border-gray-600 text-gray-300 hover:bg-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-700 hover:scale-95 border-2 rounded-full cursor-pointer text-base p-1  font-bold  active:after:border-2 active:after:border-white active:after:rounded-3xl  h-9   w-28 text-center">
                    Desktop App</li>
                  <li
                    className=" border-gray-600 text-gray-300 hover:bg-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-700 hover:scale-95 border-2 rounded-full cursor-pointer text-base p-1  font-bold  active:after:border-2 active:after:border-white active:after:rounded-3xl  h-9   w-28 text-center">
                    Web App</li>
                  <li
                    className=" border-gray-600 text-gray-300 hover:bg-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-700 hover:scale-95 border-2 rounded-full cursor-pointer text-base p-1  font-bold  active:after:border-2 active:after:border-white active:after:rounded-3xl  h-9   w-28 text-center">
                    Mobile App</li>
                </ul>
    
              </div>
              <div className="  ">
    
    
                <div className=" md:mt-0.5 md:mr-3  w-full">
                  <div className="flex mx-2 my-2  ">
                  <input type="text" name="price" id="price"
                  className=" block w-full rounded-tl-xl rounded-bl-xl border-0 h-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="  search"/>  
                    <button className="bg-white rounded-tr-xl rounded-br-xl border-0 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
    
    
            </div>
    
            <div className="text-gray-600 body-font">
              <div className={`container px-5 py-16 ${toggleProject?"":"h-[36rem]"}   overflow-hidden mx-auto`}>
    
                <div className="flex flex-wrap gap-y-14 -m-4">
                  
{
  projects.map((project,index)=>{
    return(
      <ProjectCard key={index} title={project.title} image={project.image} description={project.description} skills={project.skills} type={project.type}/>
      
    )
  })
}

    
                </div>
    
              </div>
            </div>
    
            <div  className="overflow-hidden h-16 w-full flex flex-col items-center justify-center bg-gray-400   border-2 rounded-bl-2xl rounded-br-2xl">
              
                <button onClick={handleMoreProjects}  className=" h-12 w-44 border-4 text-center   text-xl font-bold rounded-full  border-gray-600 text-slate-300 hover:bg-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-700 hover:scale-95">{toggleProject?"see less ...":"see more ..."}</button>
              
            </div>
    
          </div>
    
        </div>
    
      </section>
    );
}

export default ProjectSection;