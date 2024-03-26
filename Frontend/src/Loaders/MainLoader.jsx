import React from 'react';

function MainLoader(props) {
    
    return (
        <div className={`flex justify-center items-center bg-slate-950 h-screen bg-[url('./src/assets/bgImage.png')] bg-cover`}>
             <div className="flex  justify-center items-center">
            <span id='load' className=' bg-clip-text hover-this text-transparent bg-gradient-to-br from-yellow-300 to-red-500'>Loading...</span>
            <div className="half-spinner"></div>
          </div>
        </div>
    );
}

export default MainLoader;