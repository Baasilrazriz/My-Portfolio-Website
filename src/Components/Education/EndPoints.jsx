import React from 'react';

function EndPoints(props) {
    
    return (
<>
{
    props.position.toLowerCase()==="start"?
    <>
     <div className="flex md:contents">
                  <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
                    <div className="h-full w-9 flex items-center justify-center">
                      <div className="h-12 w-1 bg-gray-600 pointer-events-none"></div>
                    </div>
                    <div
                      className="overflow-hidden w-10 h-10 absolute top-0 -mt-3 rounded-full  bg-gray-600 shadow text-center text-white">
    
                    </div>
                  </div>
    
                </div>
    </>
    :<>
            <div className="flex md:contents">
        <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
          <div className="h-full w-9 flex items-center justify-center">
            <div className="h-12 w-1 bg-gray-600 pointer-events-none"></div>
          </div>
          <div
            className="overflow-hidden w-10 h-10 absolute bottom-0-0 -mt-3 rounded-full  bg-gray-600 shadow text-center text-white">

          </div>
        </div>

      </div>

    </>
}
</>
    );
}

export default EndPoints;