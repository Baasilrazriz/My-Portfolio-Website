import { dotPulse } from 'ldrs';
import React from 'react';
import { Bounce, Fade, Slide, Zoom } from 'react-awesome-reveal';

function SkillsCard(props) {
    return (
        <Bounce>
        <div id={props.id} 
        className="w-40 h-40  aspect-auto  bg-slate-200  text-center  border-[1px]  border-solid border-yellow-50  lg:hover:scale-125   shadow-md rounded-xl  p-1 hover:shadow-md hover:shadow-gray-500 ">
        <img src={props.image} className="w-full h-full object-contain" alt=""/>
 
      </div>
        </Bounce>
    );
}

export default SkillsCard;