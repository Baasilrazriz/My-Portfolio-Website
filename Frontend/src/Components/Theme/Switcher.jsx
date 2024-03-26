import React, { useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useDarkSide from '../../CustomHooks/useDarkSide';

function Switcher(props) {
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);
  
    const toggleDarkMode = checked => {
      setTheme(colorTheme);
      setDarkSide(checked);
    };  
    return (
        <div>
      <div>
        <DarkModeSwitch checked={darkSide} onChange={toggleDarkMode} size={36}  color='orange'/>
      </div>      
        </div>
    );
}

export default Switcher;