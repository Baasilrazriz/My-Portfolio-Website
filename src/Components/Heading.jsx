import React from "react";

function Heading(props) {
  return (
    <div
      className={`${
        props.theme == "l"
          ? "bg-slate-400 dark:bg-slate-800"
          : "bg-slate-300 dark:bg-slate-950"
      } h-auto w-100 flex flex-wrap flex-col items-center text-center px-20 py-5`}
    >
      <div className="flex flex-row dark:text-gray-500 text-gray-900 w-full h-auto justify-center pr-10 ">
        <div className="dark:text-gray-500 text-gray-900 w-full h-auto flex flex-wrap flex-col items-center ">
          <p className=" font-bold text-3xl md:text-4xl text-center">
            {props.heading}
          </p>
          <div className="w-44 h-1 border-b-4 border-yellow-400 rounded-2xl mt-2 md:mt-3 "></div>
        </div>
        
      </div>
    </div>
  );
}

export default Heading;
