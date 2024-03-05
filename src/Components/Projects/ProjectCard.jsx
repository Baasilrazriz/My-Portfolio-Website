import React, { useEffect, useState } from 'react';

function ProjectCard(props) {
 const[skills,setSkills]=useState([]);
  useEffect(() => {
    setSkills(props.skills);
  }, [props.skills]);
  console.log(skills);
const [toggleSkill,setToggleSkills]=useState(false);
  const handleMoreSkills=()=>{
    setToggleSkills(!toggleSkill)
  }
  

  
    return (
        <div id={props.key} className="xl:w-1/4 md:w-1/2 p-4">
                    <div className="bg-gray-100 p-6 rounded-lg  overflow-hidden ">
                      <img className="h-40 rounded w-full object-cover object-center mb-6" src={props.image?props.image:"https://dummyimage.com/723x403"}  
                        alt="content"/>
                      <h3 className="tracking-widest text-yellow-500 text-xs font-medium title-font">{props.language}</h3>
                      <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{props.title}</h2>
                      <p className="leading-relaxed text-base">{props.description}</p>
                      <div className={`mt-5 py-1 flex flex-wrap gap-y-5 gap-x-2 overflow-hidden ${toggleSkill?"h-full":"h-10"}`}>
                        {
                          skills.map((skill,index)=>(
                            <div key={index} className='flex justify-center items-center h-8 bg-green-700 text-gray-100 w-auto p-2 text-nowrap  rounded-full  text-xs font-semibold '>{skill}</div>
                          ))
                        }                        
                      </div>
                      <div className='flex justify-center w-full '>
                        <button className=' text-sm p-1' onClick={handleMoreSkills}>{toggleSkill?"see less skills ...":"see more skills ..."}</button>
                      </div>
                    </div>
                    
                  </div>
    );
}

export default ProjectCard;