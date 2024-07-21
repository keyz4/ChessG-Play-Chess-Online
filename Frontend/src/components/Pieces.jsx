import React from 'react'
import { Chess } from 'chess.js';
const chess = new Chess();
let board = chess.board();
import pieces from '../js/pieces';

function Pieces(square) {
    // console.log(square)
    let rank = square.rank;
    let file = square.file;
    let pieceType = square.square.type;
    let pieceColor = square.square.color;
    let piece = `${pieceType}${pieceColor}`;
    let pieceSrc = pieces[piece];

    const onDragStart = (e)=>{
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain',`${piece},${rank},${file}`)
      // setTimeout(()=>{
      //   e.target.style.display = 'none';
      // },0)
    }
    
  return (
    <div 
    draggable = {true} 
    onDragStart={onDragStart} 
    className='w-full flex justify-center items-center p-1'>
        {piece && <img className='h-full' src={pieceSrc} alt={`${pieceType} ${pieceColor}`} />}
    </div>
  )
}

export default Pieces