import React from 'react';
import { useSelector } from 'react-redux';
function NavbarDropdown() {
    const toggleNavbarDropdown = useSelector((state) => state.navbar.toggleNavbarDropdown);
    return (
        <nav className={`bg-gray-800 ${toggleNavbarDropdown?`block`:`hidden`} overflow-hidden h-full`}  >
        <div className=" lg:hidden py-10" >
    
          <div className="pt-14 overflow-y-auto">
          <ul className="space-y-2 font-bold text-gray-500 text-center">
          <li className="mx-2 cursor-pointer  hover:bg-gray-700  hover:font-extrabold font-bold  text-xl underline hover:text-white"><a href="#home">Home</a></li>
          <li className=" mx-2cursor-pointer  hover:bg-gray-700  hover:font-extrabold font-bold text-xl underline hover:text-white"><a href="#about">About</a></li>
          <li className=" mx-2cursor-pointer  hover:bg-gray-700  hover:font-extrabold font-bold text-xl underline hover:text-white"><a  href="#education">Education</a></li>
          <li className=" mx-2cursor-pointer  hover:bg-gray-700  hover:font-extrabold font-bold text-xl underline hover:text-white"><a href="#skills">Skills</a></li>
          <li className=" mx-2cursor-pointer  hover:bg-gray-700  hover:font-extrabold font-bold text-xl underline hover:text-white"><a href="#proj">Projects</a></li>
          <li className=" mx-2cursor-pointer  hover:bg-gray-700  hove   r:font-extrabold font-bold text-xl underline hover:text-white"><a href="#con">Contact</a></li>
       
            </ul>
          </div>
    
        </div>
      </nav>
    );
}

export default NavbarDropdown;