import React from 'react';
import { useNavigate } from 'react-router-dom';

function ShortChessRules() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 text-gray-200 p-8  ">
      <ul className="mb-6">
        <li className="text-3xl font-bold mb-4 text-yellow-400">Chess Rules at a Glance</li>
        <li className="mb-4">
          <ul>
            <li className="text-xl font-semibold mb-2 text-cyan-400">Objective</li>
            <li className="ml-4 mb-2">Checkmate your opponent's King to win.</li>
          </ul>
        </li>
        <li className="mb-4">
          <ul>
            <li className="text-xl font-semibold mb-2 text-pink-400">Piece Movement</li>
            <li className="ml-4 mb-2">King: One square any direction.</li>
            <li className="ml-4 mb-2">Queen: Any number of squares, any direction.</li>
            <li className="ml-4 mb-2">Rook: Any number of squares, horizontally or vertically.</li>
            <li className="ml-4 mb-2">Bishop: Any number of squares, diagonally.</li>
            <li className="ml-4 mb-2">Knight: L-shape moves.</li>
            <li className="ml-4 mb-2">Pawn: One square forward (two from starting position), captures diagonally.</li>
          </ul>
        </li>
        <li className="mb-4">
          <ul>
            <li className="text-xl font-semibold mb-2 text-green-400">Special Moves</li>
            <li className="ml-4 mb-2">Castling: King and Rook special move.</li>
            <li className="ml-4 mb-2">En Passant: Special pawn capture.</li>
            <li className="ml-4 mb-2">Promotion: Pawn reaching the other side becomes another piece.</li>
          </ul>
        </li>
        <li className="text-xl font-semibold mb-2 text-blue-400">Basic Strategies</li>
        <li className="ml-4 mb-2">Control the center and develop your pieces.</li>
      </ul>
      <button 
        onClick={() => {
          navigate('/rules');
          window.scrollTo(0, 0);}} 
        className="mt-4 bg-yellow-600 text-slate-950 py-2 px-4 rounded"
      >
        Read More
      </button>
    </div>
  );
}

export default ShortChessRules;
