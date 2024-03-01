import React from 'react';
import {useSelector } from 'react-redux';
function HomeSection(props) {
    const image = useSelector((state) => state.home.image);
    const description = useSelector((state) => state.home.description);
    return (
        <div className=" xl:mt-20 pt-[7rem]  pb-14 px-5 xl:px-0 xl:py-[10.7rem] sm:h-full w-full h-screen   bg-slate-950    text-gray-200 overflow-hidden" id="home">
        <div className="max-w-6xl mx-auto   p-4 sm:px-6 h-full">      
          <div className="max-w-sm mx-auto md:max-w-none md:grid  md:grid-cols-2 gap-6 md:gap-14 lg:gap-12 xl:gap-20 items-center">
          <a className="relative block group" href="#0">
              <div
                className="absolute inset-0 bg-gray-800 hidden md:block transform md:translate-y-2 md:translate-x-4 xl:translate-y-4 xl:translate-x-8 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-700 ease-out pointer-events-none"
                ></div>
              <figure
                className="relative h-0 pb-[56.25%] md:pb-[75%] lg:pb-[56.25%] overflow-hidden transform md:-translate-y-2 xl:-translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-700 ease-out">
                <img
                  className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out"
                  src={image}
                  width="540" height="303" alt="Blog post"/>
              </figure>
            </a>
            <div className='pt-10 xl:pt-0'>
              <div className="flex space-x-2">
  
                <h3 className="text-2xl lg:text-3xl leading-tight mb-2 font-[Poppins,sans-serif] font-[750]">
                  I’m </h3>
                <spam id="text"
                  className="text-gray-100 text-2xl lg:text-3xl leading-tight mb-2 font-[Poppins,sans-serif] font-[750]">
                </spam>
  
              </div>
              <p className="text-base xl:text-lg text-gray-400 text-justify ">{description}
              </p>
              <div className="flex items-center mt-10 ">
  
                <div className="xl:px-10 xl:pt-2 space-x-4 xl:space-x-8 text-gray-300  md:flex-row flex    text-nowrap">
                  <div><a
                      href=""><button
                        className=" overflow-hidden  h-14 w-48  sm:h-14 sm:w-52  font-bold items-center  md:text-lg  rounded-md  bg-green-900  border-green-200 border-solid border hover:bg-green-500 hover:border-2 hover:border-solid hover:scale-105 hover:shadow-md hover:shadow-green-700  hover:text-slate-950">Download
                        CV</button></a></div>
                  <div><a href="#con"><button
                        className="hover:scale-105  h-14 w-48 hover:shadow-md hover:shadow-blue-700 overflow-hidden  font-bold sm:h-14 sm:w-52 md:text-lg  items-center rounded-md  bg-blue-900   border-blue-200 border-solid border hover:bg-blue-500 hover:border-2 hover:border-solid    hover:text-slate-950">
                        Hire Me</button></a></div>
  
                </div>
  
              </div>
            </div>
          </div>

        </div>
      
    </div>
    );
}

export default HomeSection;