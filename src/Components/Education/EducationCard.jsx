import React from 'react';
import { Slide } from 'react-awesome-reveal';

function EducationCard(props) {
    return (
        <div className="flex md:contents  ">
    
                  <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative ">
    
                    <div className="h-full w-9 flex items-center justify-center">
    
                      <div className="h-full w-1  bg-gray-600 pointer-events-none"></div>
                    </div>
                    <div
                      className="overflow-hidden  w-10 h-10 absolute top-1/2 -mt-3 rounded-full bg-gray-600 shadow text-center">
                      <img className="h-full w-full" src={props.image} alt=""/>
                    </div>
                  </div>
    
                  <Slide>
                  <div className=" overflow-hidden  bg-gray-500 col-start-4 col-end-12 p-4 rounded-xl my-8 mr-auto shadow-md xl:w-[60rem] z-0">
                    <h1 className="text-gray-900 font-extrabold text-xl md:text-3xl  font-serif ">{props.title}</h1>
                    <h1 className="text-gray-800 font-extrabold text-xl md:text-2xl  font-serif  mb-3 ">{props.timestamp}</h1>
                    <p className="leading-tight text-slate-950 font-normal text-base text-justify w-full font-serif">
                      {props.description}
                    </p>
                    <p className='leading-tight relative text-slate-950 text-xl font-bold pt-5 font-serif text-justify'>{props.resultType}: <span className='text-green-900 relative font-extrabold top-[-0.125rem] left-1'>{props.result}</span>  </p>
                  </div>
                  </Slide>
                </div>
    
    );
}

export default EducationCard;