import React from 'react';
import { Link } from 'react-router-dom';
function Home() {

  return (
    <div className="main h-screen w-full flex  flex-col  items-center justify-center">
      <div className="container bg-[#1B234C] shadow-lg mt-20 rounded-lg flex flex-col md:flex-row items-center justify-center p-6 h-auto max-w-xl ">
        <div className="section flex flex-col items-center md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-8">Successful Section</h1>
          <Link to="/successfuluc" className='no-underline text-white'>
            <button className="btn-success py-3 px-6 rounded-lg font-semibold text-white md:text-lg">
              UC Successful Section
            </button>
          </Link>

        </div>
        <div className="section flex flex-col items-center md:w-1/2">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-8">Failed Section</h1>
          <Link to="/faileduc" className='no-underline text-white' >
            <button className="btn-fail py-3 px-6 rounded-lg font-semibold text-white md:text-lg ">

              UC Failed Section
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Home;
