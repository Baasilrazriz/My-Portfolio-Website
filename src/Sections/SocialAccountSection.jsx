import React from 'react';
import SocialAccountIcon from '../Components/SocialAccounts/SocialAccountIcon';
import {useSelector } from 'react-redux';
function SocialAccountSection(props) {
   const socialAccounts = useSelector((state) => state.social.socialAccounts);
    return (
//         <div className=''>
//         <div className=" z-[999] right-0 pt-[40rem] opacity-75 fixed end-2 top-6 lg:end-8 lg:top-8">
//  <a className="inline-block rounded-full bg-teal-600 p-4 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-3"
//    href="#">
//    <span className="sr-only">Back to top</span>

//    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//      <path fill-rule="evenodd"
//        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
//        clip-rule="evenodd" />
//    </svg>
//  </a>
// </div>

// <div className=" right-2 md:right-0 flex flex-col gap-5  mt-[10rem] opacity-100 fixed sm:end-6 top-6 lg:end-8 lg:top-8 ">
// {
//     socialAccounts.map((account)=>(
//         <div className='z-50'>
//           <SocialAccountIcon name={account.name} url={account.url} image={account.image}/>
//         </div>
//     ))
// }
// </div>

// </div>
<>
<div class=" right-0 pt-[40rem] opacity-75 fixed sm:end-6 sm:top-6 lg:end-8 lg:top-8">
        <a class="inline-block rounded-full bg-teal-600 p-2 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-4 hover:scale-125"
          href="#">
          <span class="sr-only">Back to top</span>

          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg>
        </a>
      </div>

      <div class=" right-0  mt-[10rem] opacity-100 fixed sm:end-6 sm:top-6 lg:end-8 lg:top-8">
        <a class="inline-block  rounded-full  text-white shadow hover:bg-teal-500   transition-all ease-in delay-75 hover:scale-125 hover:shadow-sm hover:shadow-white"
          href="https://www.facebook.com/muhammadbaasil.irfan">
          <img class="w-full h-full object-contain rounded-full" src="src\assets\social\icons8-facebook-circled.gif" alt=""/>
        </a>
      </div>


      <div class=" right-0  mt-[14rem] opacity-100 fixed sm:end-6 sm:top-6 lg:end-8 lg:top-8">
        <a class="inline-block  rounded-full  text-white shadow  hover:bg-teal-500 transition-all ease-in delay-75 hover:scale-125 hover:shadow-sm hover:shadow-white"
          href="https://www.instagram.com/basilrazriz/">
          <img class="w-full h-full object-contain rounded-full" src="src\assets\social\icons8-instagram.gif" alt=""/>
        </a>
      </div>


      <div class=" right-0  mt-[18rem] opacity-100 fixed sm:end-6 sm:top-6 lg:end-8 lg:top-8">
        <a class="inline-block  rounded-full  text-white shadow transition-all ease-in delay-75 hover:scale-125 hover:shadow-sm hover:shadow-white hover:bg-teal-500"
          href="https://www.linkedin.com/in/muhammad-basil-irfan-rizvi-886157215/">
          <img class="w-full h-full object-contain rounded-full" src="src\assets\social\icons8-linkedin-circled.gif" alt=""/>
        </a>
      </div>
      <div class=" right-0  mt-[22rem] opacity-100 fixed sm:end-6 sm:top-6 lg:end-8 lg:top-8">
        <a class="inline-block  rounded-full  text-white shadow transition-all ease-in delay-75 hover:scale-125 hover:shadow-sm hover:shadow-white hover:bg-teal-500"
          href="https://github.com/Baasilrazriz">
          <img class="w-full h-full object-contain rounded-full" src="src\assets\social\icons8-github.gif" alt=""/>
        </a>
      </div>

</>
    );
}

export default SocialAccountSection;