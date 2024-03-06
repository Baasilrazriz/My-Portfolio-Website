import React from 'react';
import { useSelector } from 'react-redux';
import SocialAccountIcon from '../Components/SocialAccounts/SocialAccountIcon';

function FooterSection(props) {
  const socialAccounts = useSelector((state) => state.social.socialAccounts);
  return (
        <footer class="bg-gray-800">
        <div class="relative mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8 lg:pt-24">
    
          <div class="lg:flex lg:items-end lg:justify-between hidden">
            <div class="">
              <img src="/img/flg_logo11134.png" class="h-[70px] w-80" alt=""/>
    
            </div>
    
            <ul class="mt-12 flex flex-wrap justify-center  md:gap-2 lg:mt-0 lg:justify-end lg:gap-5">
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  Home
                </a>
              </li>
    
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  About
                </a>
              </li>
    
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  Education
                </a>
              </li>
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  skills
                </a>
              </li>
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  Achievements
                </a>
              </li>
    
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  Project
                </a>
              </li>
    
              <li>
                <a class="text-gray-400 font-serif text-lg transition hover:text-gray-700/75" href="/">
                  Contact
                </a>
              </li>
            </ul>
          </div>
    
          <div class="md:mt-5 md:pl-14  pl-20 flex md:gap-3 gap-3 w-full">
          {
    socialAccounts.map((account)=>(
        <SocialAccountIcon name={account.name} url={account.url} image={account.image}/>
    ))
}
          </div>
            <p class="mt-5 md:mt-20 md:ml-[15rem] text-center  text-gray-400 font-serif text-base lg:text-right">
              Copyright &copy; 2023. All rights reserved.
            </p>
          
        </div>
    
    
    
        
      </footer>
    );
}

export default FooterSection;