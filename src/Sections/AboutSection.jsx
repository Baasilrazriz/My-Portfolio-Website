import React from 'react';
import Heading from '../Components/Heading';
import {useDispatch, useSelector } from 'react-redux';
import { downloadcv } from '../Store/Features/homeSlice';
function AboutSection(props) {
const dispatch=useDispatch()
  const profilePic = useSelector((state) => state.about.Profilepic);
    const about = useSelector((state) => state.about.about);
    return (
        <div className=" bg-slate-800 overflow-hidden " id="about">

     <Heading theme="l" heading="About Me"/>
        <div className="xl:py-12 xl:pr-44 xl:pl-20      ">
  
          <div  className="  md:flex  md:flex-row flex flex-col justify-center items-center     gap-20">
           <div className='md:w-1/3'>
           <div className="  md:ml-2 xl:ml-5   lg:mx-20 xl:h-96 xl:w-96 lg:h-72 lg:w-72 xl:mt-[-6rem]  h-64 w-64 rounded-full overflow-hidden  border-2 border-black">              
              <img className='h-full w-full object-cover' src={profilePic} alt=""/>
            </div>
           </div>
  <div className=' md:w-2/3   '>
  <h1 className="font-bold text-white  font-serif md:mx-0 mx-20 text-3xl">Hello everyone!</h1>
              <p className="mt-2 mb-8  xl:pr-0 md:pr-14 md:mx-0 mx-20 text-justify md:text-lg font-serif text-gray-400"> {about}</p>
              <div className='flex flex-col'>
              <div className="sm:flex block sm:mx-5 mx-20   xl:px-10   lg:mr-4 text-nowrap gap-10 ">
  
  <div >

    <div className="flex gap-2 ">
      <h1 className="font-medium text-white  font-serif  xl:text-2xl lg:text-lg sm:text-xl text-[1.4rem] ">Name :</h1>
      <p className="pt-1  text-justify xl:text-xl lg:text-lg  text-[1.4rem] font-serif sm:text-xl text-gray-400">Muhammad Basil irfan Rizvi
      </p>
    </div>

    <div className="flex gap-2">
      <h1 className=" font-medium text-white  font-serif  xl:text-2xl lg:text-lg sm:text-xl text-[1.4rem]">DOB :</h1>
      <p className="pt-1  text-justify xl:text-xl lg:text-lg text-[1.4rem] font-serif sm:text-xl text-gray-400">June 30,2003</p>
    </div>

    <div className="flex gap-2">
      <h1 className="  font-medium text-white  font-serif lg:text-lg  xl:text-2xl sm:text-xl text-[1.4rem]">Sex :</h1>
      <p className="pt-1  text-justify xl:text-xl  text-[1.4rem] font-serif lg:text-lg sm:text-xl text-gray-400">M</p>
    </div>


  </div>

  <div className=" ">

    <div className="flex gap-2">
      <h1 className=" font-medium text-white  font-serif lg:text-lg  xl:text-2xl sm:text-xl text-[1.4rem]">Location:</h1>
      <p className="pt-1  text-justify xl:text-xl  text-[1.4rem] lg:text-lg font-serif sm:text-xl  text-gray-400">Karachi, Sindh, Pakistan
      </p>
    </div>

    <div className="flex gap-2">
      <h1 className=" font-medium text-white  font-serif lg:text-lg  xl:text-2xl sm:text-xl  text-[1.4rem]">Email:</h1>
      <p className="pt-1  text-justify xl:text-xl text-[1.4rem] lg:text-lg font-serif sm:text-xl text-gray-400">baasilrazriz@gmail.com</p>
    </div>

    <div className="flex gap-2">
      <h1 className=" font-medium text-white  font-serif  lg:text-lg xl:text-2xl text-[1.4rem]">Phone:</h1>
      <p className="pt-1  text-justify xl:text-xl text-[1.4rem] lg:text-lg font-serif sm:text-xl text-gray-400">+923237184249</p>
    </div>


  </div>

</div>
<div>
<div className="flex items-center mt-20 mb-5 justify-around">
  
  <div className=" sm:space-x-7 space-x-3 md:flex-row flex  ">
    <div>
        <button onClick={()=>{
          dispatch(downloadcv())
        }}
          className="transition-all delay-175 overflow-hidden  h-14 w-48 items-center sm:h-14 sm:w-56 rounded-3xl font-bold text-xl bg-green-900 text-gray-100  border-green-200 border-solid border-2 hover:bg-green-400 hover:border-1 hover:border-solid hover:border-black  hover:text-slate-950 hover:scale-105 hover:shadow-lg hover:shadow-green-700">Download
          CV</button></div>

    <div><a href="#con"><button
          className="transition-all delay-175 overflow-hidden h-14 w-48 sm:h-14 sm:w-56 items-center   text-xl rounded-3xl font-bold bg-blue-900 text-gray-100 border-blue-200 border-solid border-2 hover:bg-blue-400 hover:border-1 hover:border-solid hover:border-black  hover:text-slate-950 hover:scale-105 hover:shadow-lg hover:shadow-blue-700">Hire
          Me</button></a>
          </div>



  </div>


</div>
</div>
              </div>
  
             </div>   
             
   
            
          </div>
          
        </div>
  
  
  
      </div>
    );
}

export default AboutSection;