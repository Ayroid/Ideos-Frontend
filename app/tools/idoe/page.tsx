import React from 'react'
import { FaRobot } from 'react-icons/fa'
// import { TypewriterEffect } from '@/components/ui/typewriter-effect'


const Ido = () => {
  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "apps",
    },
    {
      text: "with",
    },
    {
      text: "Aceternity.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-primary">IDOe</h1>
        <FaRobot className="h-10 w-10 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Hello, VIDHANT
          </h1>
          <h2 className="text-5xl font-semibold text-gray-500 mt-4">
            How can I help you today?
          </h2>
        </div>
      </div>


      {/* <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-600 dark:text-neutral-200 text-base  mb-10">
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Signup
        </button>
      </div>
    </div> */}
    </>
  )
}

export default Ido