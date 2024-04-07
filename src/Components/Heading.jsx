import React from "react";

function Heading(props) {
  const admin=true;
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
        {admin ? (
          <div className=" hidden xl:block">
          {props.onclick?(<>
            <button
              onClick={props.onclick}
              className="hover:scale-105  h-14 w-14 hover:shadow-md hover:shadow-gray-700 overflow-hidden  font-bold sm:h-14 sm:w-32 md:text-lg  items-center rounded-md bg-gray-300  dark:bg-gray-900 hover:bg-gray-900   border-blue-200 border-solid border dark:hover:bg-gray-500 hover:border-2 hover:border-solid hover:text-white    dark:hover:text-slate-950"
            >
              Edit details
            </button>
          </>):(<></>)

          }
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Heading;
