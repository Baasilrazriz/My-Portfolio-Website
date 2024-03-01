import React from 'react';

function Heading(props) {
    return (
        <div className="bg-slate-800 h-auto w-100 flex flex-wrap flex-col items-center text-center px-10 py-5" id={props.id}>
        <div className="text-gray-500 w-full h-auto flex flex-wrap flex-col items-center ">
          <p className=" font-bold text-3xl md:text-4xl text-center">{props.heading}</p>
          <div className="w-44 h-1 border-b-4 border-yellow-400 rounded-2xl mt-2 md:mt-3 ">
          </div>
        </div>
      </div>
    );
}

export default Heading;