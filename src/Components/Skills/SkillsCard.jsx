import React from 'react';

function SkillsCard(props) {
    return (
        <div id={props.id} 
        className="w-40 h-40  aspect-auto  bg-slate-200  text-center  border-[1px]  border-solid border-yellow-50  hover:scale-125   shadow-md rounded-xl  p-1 hover:shadow-md hover:shadow-gray-500 ">
        <img src={props.image} className="w-full h-full object-contain" alt=""/>
 
      </div>
    );
}

export default SkillsCard;