import React, { useState } from "react";
import { closeProjectModal } from "../Store/Features/projectSlice";



function ProjectsModal(props) {
  
  const handleClose = () => {
    dispatch(closeProjectModal());
    document.body.style.overflowY = "scroll";
  };
  
   
//   const editProject = useSelector((state) => state.projects.editProject);
  
//   const handleImageChange = (e) => {
//     const files = e.target.files;

//     if (files && files.length > 0) {
//       const promises = [];
//       const newImageBase64Array = [];

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         const promise = new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             newImageBase64Array.push(reader.result);
//             resolve();
//           };
//           reader.onerror = reject;
//           reader.readAsDataURL(file);
//         });
//         promises.push(promise);
//       }

//       Promise.all(promises)
//         .then(() => {
//           setImageBase64(newImageBase64Array[0]);
          
//           setImages(newImageBase64Array);
//         })
//         .catch((error) => {
//           console.error("Error reading files:", error);
//         });
//     }
//   };

  return (
    
        <>
          <div>
            <div className=" z-50 modal-overlay fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
              <div
                className={`  bg-slate-300 dark:bg-slate-600 transition-all ease-in    h-[32rem] w-[65rem] rounded-md overflow-hidden`}
              >
                <div className="">
                  <div
                    className="flex justify-end mt-1 mr-1 "
                    onClick={handleClose}
                  >
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
        </>

  );
}

export default ProjectsModal;
