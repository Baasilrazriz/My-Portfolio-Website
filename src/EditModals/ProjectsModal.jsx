import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeProjectModal } from "../Store/Features/projectSlice";
import Heading from "../Components/Heading";
import { useForm } from "react-hook-form";

function ProjectsModal(props) {
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => console.log(data)

  const [imageBase64, setImageBase64] = useState("");
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeProjectModal());
    document.body.style.overflowY = "scroll";
  };
  const editProject = useSelector((state) => state.projects.editProject);
  const handleImageChange = (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const promises = [];
      const newImageBase64Array = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const promise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {

            newImageBase64Array.push(reader.result);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        promises.push(promise);
      }
      

      Promise.all(promises)
        .then(() => {
          setImageBase64(newImageBase64Array[0])
          console.log(newImageBase64Array[0]);
          setImages(newImageBase64Array);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };

  return (
    <>
      {editProject && (
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
                <div>
                  <div>
                    <div className="mt-[-1.5rem] dark:text-gray-900 text-gray-900 w-full h-auto flex flex-wrap flex-col items-center ">
                      <p className=" font-bold text-3xl md:text-4xl text-center">
                        Add Project
                      </p>
                      <div className="w-44 h-1 border-b-4 border-yellow-400 rounded-2xl mt-2 md:mt-3 "></div>
                    </div>
                    <div className="flex mt-2   ">
                      <div className=" h-full w-1/3 ">
                        {/* images */}
                        <div className="my-4 ml-10 flex flex-col gap-2 justify-center items-center">
                          <div className="h-44 w-44 rounded-full shadow-lg shadow-neutral-950 overflow-hidden">
                            <img
                              src={imageBase64}
                              className=" h-full w-full object-cover"
                            />
                          </div>

                          <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className=" "
                            multiple
                            name="images"
                          />
                          <div className="flex flex-wrap justify-center  ml-8">
                            {images.map((item) => (
                              <div className="h-16 w-16 rounded-full shadow-lg shadow-neutral-950 overflow-hidden" onClick={()=>{ setImageBase64(item)}}>
                                <img
                                  src={item}
                                  className=" h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="h-[26.69rem] w-2/3 overflow-x-hidden overflow-y-scroll pb-10">
                        {/* description */}
                        <form className=" mx-20 mt-5" onSubmit={handleSubmit(onSubmit)}>
                          <div className="flex flex-col  gap-3 ">
                            <label className="sr-only" htmlFor="from_name">
                              Title
                            </label>
                            <input
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Title"
                              type="text"
                              name="title"
                              {...register("title")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_email">
                            Description
                            </label>
                            <textarea
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Description"
                              type="text"
                              name="description"
                              {...register("description")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_email">
                            Overview
                            </label>
                            <textarea
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Overview"
                              type="text"
                              name="Overview"
                              {...register("overview")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_name">
                              Tech Stack
                            </label>
                            <input
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Tech Stack"
                              type="text"
                              name="tech"
                              {...register("tech")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_name">
                              Live Link
                            </label>
                            <input
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="LiveLink"
                              type="text"
                              name="live_link"
                              {...register("live_link")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_name">
                              Git Repo Link
                            </label>
                            <input
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Git Repo Link"
                              type="text"
                              name="git_link"
                              {...register("git_link")}
                              required
                            />
                            <label className="sr-only" htmlFor="from_name">
                              Category
                            </label>
                            <select
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Title"
                              type="text"
                              {...register("category")}
                              name="category"
                              required
                            >
                              <option value="Desktop App">Desktop App</option>
                              <option value="Web App">Web App</option>
                              <option value="Mobile App">Mobile App</option>
                            </select>
                            <label className="sr-only" htmlFor="from_name">
                              date
                            </label>
                            <input
                              className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                              placeholder="Date"
                              type="Date"
                              name="date"
                              {...register("date")}
                              
                              required
                            />
                            <div className="flex justify-center items-center">
                            <input type="submit" value="Submit" className="transition-all delay-175 overflow-hidden h-14 w-48 sm:h-12 sm:w-64 items-center cursor-pointer focus:animate-pulse   text-lg rounded-xl font-bold bg-blue-900 text-gray-100 border-blue-200 border-solid border-2 hover:bg-blue-400 hover:border-1 hover:border-solid hover:border-black  hover:text-slate-950 hover:scale-105 hover:shadow-lg hover:shadow-blue-700" />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProjectsModal;
