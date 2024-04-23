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
                    <div className="bg-gray-100 p-4 rounded-lg  overflow-hidden h-[28rem]">
                      <img className="h-40 rounded w-full object-cover object-center " src={props.image?props.image:"https://dummyimage.com/723x403"}  
                        alt="content"/>
                      <h3 className="tracking-widest text-yellow-500 text-xs ml-1  font-medium title-font mt-5">{props.language?props.language:"C#"}</h3>
                      <h2 className="text-lg  font-bold ml-1 text-gray-800 text-center   mb-1">{props.title}</h2>
                      <p className="leading-relaxed text-base text-ellipsis ml-1 line-clamp-4 text-left">{props.overview}</p>
                      <div className={`mt-5 py-1 flex flex-wrap gap-y-5 gap-x-2 overflow-hidden ${toggleSkill?"h-full":"h-10"}`}>
                        {
                          skills.map((skill,index)=>(
                            <div key={index} className='flex justify-center items-center h-8 bg-gray-400 text-slate-950 w-auto p-2 text-nowrap  rounded-full  text-xs font-bold '>{skill}</div>
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