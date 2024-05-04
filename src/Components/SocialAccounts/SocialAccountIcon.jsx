import React from "react";

function SocialAccountIcon(props) {
  return (
    <a
      className="    inline-block  rounded-full  text-white shadow transition-all ease-in delay-75 hover:bg-teal-500 overflow-hidden hover:scale-125 hover:shadow-md hover:shadow-gray-500"
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="w-full h-full object-cover  "
        src={props.image}
        
      />
    </a>
  );
}

export default SocialAccountIcon;
