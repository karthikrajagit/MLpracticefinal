import React from 'react';

const Intro = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white px-4 text-center">
      <div className="animate-fadeIn">
        <div className='flex flex-row gap-5 ml-20'>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-4">
            DEEPCODE
          </h1>
          <h2 className='text-4xl md:text-5xl font-semibold text-blue-300 drop-shadow-md mb-4 mt-2'>is the </h2>
        </div>

        
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-4">
          MACHINE LEARNING
        </h1>
        <h2 className="text-4xl md:text-5xl font-semibold text-blue-300 drop-shadow-md mb-4">
          PROBLEM SOLVING
        </h2>
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-6">
          WEB APP
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 italic">
          Think Critically. Solve Intelligently.
        </p>
      </div>
    </div>
  );
};

export default Intro;
