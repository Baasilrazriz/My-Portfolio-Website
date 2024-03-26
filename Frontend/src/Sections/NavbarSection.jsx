import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import {useSelector } from 'react-redux';
import NavbarDropdown from '../Components/Navbar/NavbarDropdown';

function NavbarSection(props) {
    const toggleNavbarDropdown = useSelector((state) => state.navbar.toggleNavbarDropdown);
  console.log(NavbarDropdown)
    return (
        <div>
            <Navbar/>
  {toggleNavbarDropdown?(<>
   <NavbarDropdown/>
  </>):(<></>)}
        </div>
    );
}

export default NavbarSection;