import React from 'react';

function SocialAccountIcon(props) {
    return (
        <a id={props.name} className="inline-block  rounded-full  text-white shadow transition-all ease-in delay-75 hover:bg-teal-500 "
   href={props.url}>
   <img className="w-full h-full object-contain rounded-full hover:scale-125 hover:shadow-md hover:shadow-gray-500" src={props.image} alt=""/>
 </a>
    );
}

export default SocialAccountIcon;