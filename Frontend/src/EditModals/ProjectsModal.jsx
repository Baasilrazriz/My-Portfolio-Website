import React from "react";

function ProjectsModal(props) {
  const handleClose = () => {
    // dispatch(closeRestrauntModal());
    document.body.style.overflowY = "scroll";
  };
  return (
    <div>
      <div className=" z-50 modal-overlay fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
        <div
          className={` login-modal bg-white transition-all ease-in    h-[32rem] w-[35rem] rounded-md overflow-x-hidden overflow-y-auto`}
        >
          <div className="">
            <div className="flex justify-end mt-1 mr-1 " onClick={handleClose}>
              <button
                className="relative top-1 right-1  bg-red-500 text-white px-2 py-1 rounded-full transform transition-all duration-500 ease-in-out hover:scale-110   active:animate-bounce"
                onClick={handleClose}
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
