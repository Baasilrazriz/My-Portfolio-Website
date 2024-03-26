import React from 'react';
import emailjs from 'emailjs-com';

function ContactSection(props) {
  const sendEmail = (e) => {
    e.preventDefault();
    
    emailjs.sendForm('service_e4ajvle', 'template_yvzd4fl', e.target, 'uRsOwhI0RI7Tk9XQn')
      .then((result) => {
        console.log(result.text);
        alert("email sent")
      }, (error) => {
        console.log(error.text);
      });
  };

  return (
    <section id="con" className="bg-slate-950 ">
      <div className=" ">
        <div className="bg-slate-950 h-auto w-100 flex flex-wrap flex-col items-center text-center p-10" id="proj">
          <div className="text-gray-500 w-full h-auto flex flex-wrap flex-col items-center ">
            <p className=" font-bold text-3xl md:text-4xl text-center">Contact Me</p>
            <div className="w-44 h-1 border-b-4 border-yellow-400 rounded-2xl mt-2 md:mt-3 ">
            </div>

            <div className="h-auto md:w-[1100px]">
              <p className="text-center w-full  mt-10 text-lg  md:text-2xl font-serif font-bold">
                Feel free to Contact me by submitting the form and I will get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div>
          <section className="">
            <div className="text-gray-400 mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 ">
              <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5 md:mx-0 mx-10 ">
                <div className="lg:col-span-2 lg:py-12">
                  <div className="mt-8">
                    <div className="">
                      <a href='https://www.google.com/maps?q=Karachi' className="flex  py-3 border-2 border-black  rounded-lg bg-gray-800 mb-5 hover:scale-105 hover:border-green-500 hover:drop-shadow-xl transition-shadow ">
                        <h1 className="md:pr-3 ml-2 font-medium text-gray-400  font-serif  md:text-2xl text-lg">Location:</h1>
                        <h1 className="pt-0.5  text-center md:text-2xl text-base font-serif text-green-500">Karachi, Sindh,
                          Pakistan
                        </h1>
                      </a>

                      <a href='mailto:baasil869@gmail.com?subject=For%20Job%20Offer&body=Hi%20there,' className="flex py-3 border-2 border-black  rounded-lg bg-gray-800 mb-5 hover:scale-105 hover:border-blue-700 hover:drop-shadow-xl transition-shadow">
                        <h1 className="md:pr-3 ml-2 font-medium text-gray-400  font-serif  md:text-2xl text-lg">Email:</h1>
                        <h1 className="pt-0.5  text-center md:text-2xl text-base font-serif text-blue-700">
                          baasilrazriz@gmail.com</h1>
                      </a>

                      <a href='https://wa.me/+923237184249' className="flex  py-3 border-2 border-black  rounded-lg bg-gray-800 mb-5 hover:scale-105 hover:border-red-600 hover:drop-shadow-xl transition-shadow">
                        <h1 className="md:pr-3 ml-2 font-medium  text-gray-400 font-serif  md:text-2xl text-lg">Phone:</h1>
                        <h1 className="pt-0.5  text-center md:text-2xl text-base font-serif text-red-600">+923237184249</h1>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-gray-500 bg-gray-500 w-auto  md:h-auto overflow-hidden shadow-lg lg:col-span-3 lg:p-10 p-5 ">
                  <form onSubmit={sendEmail} className="space-y-4">
                    <div className="flex justify-between gap-9 mb-8">
                      <label className="sr-only" htmlFor="from_name">Name</label>
                      <input
                        className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                        placeholder="Name" type="text" id="from_name" name="from_name" required />
                      <label className="sr-only" htmlFor="from_email">Email</label>
                      <input
                        className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                        placeholder="Email address" type="from_email" id="from_email" name="from_email" required />
                    </div>

                    <div className=" ">
                      <div className=" mb-8">
                        <label className="sr-only" htmlFor="from_subject">Subject</label>
                        <input className="w-full rounded-lg  bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                          placeholder="Subject" type="text" id="subject" name="from_subject" />
                      </div>    
                    </div>

                    <div>
                      <label className="sr-only" htmlFor="message">Message</label>
                      <textarea
                        className="w-full rounded-lg border-gray-200 bg-gray-200 p-3 text-sm hover:border-2 hover:border-black"
                        placeholder="Message" rows="8" id="message" name="message" required></textarea>
                    </div>

                    <div className="flex justify-end">
                      <div>
                        <button type="submit"
                          className=" overflow-hidden px-7 md:px-10 items-center p-3 rounded-xl font-bold text-xl bg-slate-950 text-gray-400  border-gray-400 border-solid border-2 hover:bg-gray-700 hover:border-2 hover:border-solid hover:border-black  hover:text-slate-950">
                          SEND</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
