import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='flex h-16 bg-slate-950'>
      <div className='h-full w-16 rounded-full p-2' >
        <img className='rounded-full' src="/chessGlogo.svg" alt="" />
      </div>
      <div className='w-1/3 flex justify-between items-center'>
        <Link to='/' className='text-white m-3 mr-2 hover:underline font-bold underline-offset-4'>Home</Link>
        <div className='relative '>
          <button onClick={toggleDropdown} className='text-white m-3 mr-2 hover:underline font-bold underline-offset-4'>
            Play
          </button>
          {dropdownOpen && (
            <div className='absolute bg-slate-900 mt-2 w-48 rounded-md shadow-lg'>
              <Link to='/playonline' className='block px-4 py-2 text-white hover:bg-slate-700'>Play Online</Link>
              <Link to='/stockfish' className='block px-4 py-2 text-white hover:bg-slate-700'>Play Stockfish</Link>
            </div>
          )}
        </div>
        <Link to='/rules' className='text-white m-3 mr-2 hover:underline font-bold underline-offset-4'>Rules</Link>
        <Link to='/blogs' href='#' className='text-white m-3 mr-2 hover:underline font-bold underline-offset-4 text-nowrap'>Chess Today</Link>
        <Link to='/blogs' href='#' className='text-white m-3 mr-2 hover:underline font-bold underline-offset-4 hidden md:flex'>Creator</Link>
        
      </div>
      <div className='w-2/3 hidden lg:flex justify-end items-center'>
        <button className='text-white h-9 m-3 mr-2 border-white border-2 w-24 rounded-md hover:bg-slate-500 font-bold'>Log In</button>
        <button className='text-white h-9 m-3 ml-2 mr-5 border-white border-2 w-24 rounded-md hover:bg-slate-500 font-bold'>Sign Up</button>
      </div>
    </div>
  );
}

export default NavBar;
