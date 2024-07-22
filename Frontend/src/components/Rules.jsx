import React from 'react';

function Rules() {
  return (
    <div className="bg-slate-950 text-gray-200 p-8 text-left">
      <ul className="mb-6">
        <li className="text-3xl font-bold mb-4 text-yellow-400 text-center">Welcome to the World of Chess!</li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-cyan-400">Chessboard Setup</li>
            <li className="ml-4 mb-2">The Board: An 8x8 grid with alternating light and dark squares.</li>
            <li className="ml-4 mb-2">The Pieces: Each player has 16 pieces - 1 King, 1 Queen, 2 Rooks, 2 Knights, 2 Bishops, and 8 Pawns.</li>
            <li className="ml-4 mb-2">Starting Position:</li>
            <li className="ml-8 mb-2">White pieces on the first and second ranks.</li>
            <li className="ml-8 mb-2">Black pieces on the seventh and eighth ranks.</li>
          </ul>
        </li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-pink-400">Objective</li>
            <li className="ml-4 mb-2">Checkmate: Trap your opponent's King so it cannot escape capture.</li>
          </ul>
        </li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-green-400">How Pieces Move</li>
            <li className="ml-4 mb-2">King: Moves one square in any direction.</li>
            <li className="ml-8 mb-2">Special Move: Castling - a move involving the King and a Rook.</li>
            <li className="ml-4 mb-2">Queen: Moves any number of squares along a rank, file, or diagonal.</li>
            <li className="ml-4 mb-2">Rook: Moves any number of squares along a rank or file.</li>
            <li className="ml-4 mb-2">Bishop: Moves any number of squares diagonally.</li>
            <li className="ml-4 mb-2">Knight: Moves in an "L" shape - two squares in one direction and then one square perpendicular.</li>
            <li className="ml-4 mb-2">Pawn: Moves forward one square, but captures diagonally.</li>
            <li className="ml-8 mb-2">Special Moves:</li>
            <li className="ml-12 mb-2">En Passant: Capture a pawn that moves two squares from its starting position.</li>
            <li className="ml-12 mb-2">Promotion: When a pawn reaches the opposite end of the board, it can be promoted to any piece (except a King).</li>
          </ul>
        </li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-purple-400">Special Rules</li>
            <li className="ml-4 mb-2">Castling:</li>
            <li className="ml-8 mb-2">King moves two squares towards a Rook, and the Rook moves to the square next to the King.</li>
            <li className="ml-8 mb-2">Conditions: Neither the King nor the Rook involved has moved before, no pieces between them, and the King is not in check.</li>
            <li className="ml-4 mb-2">Check: When a King is under direct threat of capture.</li>
            <li className="ml-8 mb-2">Must make a move to get out of check.</li>
            <li className="ml-4 mb-2">Checkmate: When a King is in check and cannot escape.</li>
            <li className="ml-4 mb-2">Stalemate: When a player has no legal moves and their King is not in check - results in a draw.</li>
          </ul>
        </li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-blue-400">Basic Strategies</li>
            <li className="ml-4 mb-2">Control the Center: Dominating the center of the board gives your pieces more mobility.</li>
            <li className="ml-4 mb-2">Develop Your Pieces: Move your Knights and Bishops early to prepare for battle.</li>
            <li className="ml-4 mb-2">King Safety: Protect your King by castling early.</li>
          </ul>
        </li>
        <li>
          <ul className="mb-4">
            <li className="text-2xl font-semibold mb-2 text-red-400">Tips for Beginners</li>
            <li className="ml-4 mb-2">Think Ahead: Always consider your opponent's possible moves.</li>
            <li className="ml-4 mb-2">Protect Your Pieces: Avoid unnecessary sacrifices.</li>
            <li className="ml-4 mb-2">Keep Learning: Chess is a game of endless possibilities; keep studying and practicing!</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Rules;
