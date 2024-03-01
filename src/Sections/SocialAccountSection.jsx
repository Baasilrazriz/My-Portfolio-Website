import React from 'react';
import SocialAccountIcon from '../Components/SocialAccounts/SocialAccountIcon';
import {useSelector } from 'react-redux';
function SocialAccountSection(props) {
   const socialAccounts = useSelector((state) => state.social.socialAccounts);
    return (
        <div className=''>
        <div className=" right-0 pt-[40rem] opacity-75 fixed end-2 top-6 lg:end-8 lg:top-8">
 <a className="inline-block rounded-full bg-teal-600 p-3 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-3"
   href="#">
   <span className="sr-only">Back to top</span>

   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
     <path fill-rule="evenodd"
       d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
       clip-rule="evenodd" />
   </svg>
 </a>
</div>

<div className=" right-2 md:right-0 flex flex-col gap-5  mt-[10rem] opacity-100 fixed sm:end-6 top-6 lg:end-8 lg:top-8 ">
{
    socialAccounts.map((account)=>(
        <SocialAccountIcon name={account.name} url={account.url} image={account.image}/>
    ))
}
</div>

</div>
    );
}

export default SocialAccountSection;