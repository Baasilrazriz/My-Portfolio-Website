import React from 'react';

function CertificateCard(props) {
    return (
        <a href={props.link} id={props.id}  className="relative w-80 h-48 aspect-auto bg-slate-200 text-center  lg:hover:scale-110 shadow-md rounded-xl  hover:shadow-md hover:shadow-gray-500">
        <img src={props.image} className="w-full h-full object-fill rounded-xl" alt="" />
        <div className="  absolute inset-0 flex flex-col justify-center items-center bg-gray-400  bg-opacity-95 rounded-xl transition-opacity opacity-0 hover:opacity-100 ease-in  delay-75">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{props.title}</h2>
          <p className="text-gray-600">{props.org}</p>
        </div>
      </a>
  
    );
}

export default CertificateCard;