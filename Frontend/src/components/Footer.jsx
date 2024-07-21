import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/chessGlogo.jpeg'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pr-2 pl-2">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center border-t-2 p-4 border-slate-600 ">
        {/* Logo and Quote */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="rounded-full h-16 w-16 mb-2" />
          <p className="text-center text-sm italic">"When you see a good move, look for a better one."</p>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <Link to="/" className="text-lg font-semibold hover:text-gray-300 transition-colors duration-300">Home</Link>
          <Link to="/stockfish" className="text-lg font-semibold hover:text-gray-300 transition-colors duration-300">Play</Link>
          <Link to="/creator" className="text-lg font-semibold hover:text-gray-300 transition-colors duration-300">Creator</Link>
          <Link to="/blogs" className="text-lg font-semibold hover:text-gray-300 transition-colors duration-300">Blogs</Link>
          {/* Add more links as needed */}
        </div>
        
        {/* Copyright Text */}
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} ChessG.com. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
