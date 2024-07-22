import React, { useState, useEffect } from 'react';
import pieces from '../js/pieces';

function ControlPanel({ theme, socket,room,WhiteKills,BlackKills,stockfishRole }) {
  const [history, setHistory] = useState([]);
  
  const handleDraw = ()=>{
    socket.emit('draw',{room});
  }
  const handleResign = ()=>{
    socket.emit('resign',{room});
  }
  useEffect(() => {
    socket.on('game_history', (game_history) => {
      // console.log(game_history);
      setHistory(game_history);
    });
  }, [socket]);

  const decodeMove = (move)=>{
    if(move.length===2) return `pawn ${move[0]}${move[1]}`
    switch(move[0]){
      case 'K':
        return `King ${move[1]}${move[2]}`
      case 'Q':
        return `Queen ${move[1]}${move[2]}`
      case 'N':
        return `Knight ${move[1]}${move[2]}`
      case 'B':
        return `Bishop ${move[1]}${move[2]}`
    }
  }

  const formatMove = (move, player,index) => {
    move = decodeMove(move);
    return `${index+1} ${player === 'b' ? 'White' : 'Black'} played ${move}`;
  };

  const renderHistory = () => {
    return history.map((move, index) => (
      <div key={index} className={`w-full flex`}>
        <div className='w-max h-max'>
          {formatMove(move, index % 2 === 0 ? 'b' : 'w',index)} {/* Alternating between 'b' (black) and 'w' (white) */}
        </div>
      </div>
    ));
  };

  return (
    <div className='h-full w-full p-2 overflow-hidden flex flex-col-reverse md:flex-col'>
      <div className={`h-1/5 border-2 border-${theme}-700 rounded-xl m-1 flex justify-center items-center`}>
        {!stockfishRole && <div className='flex' >
          <button onClick={handleDraw} className={`border-2 border-white rounded-2xl w-28 h-16 ml-4 bg-${theme}-600 text-2xl flex justify-center items-center font-semibold text-white font-mono hover:bg-${theme}-500`}>Draw</button>
        <a href="/">
          <button onClick={handleResign} className={`border-2 border-white rounded-2xl w-28 h-16 ml-4 bg-${theme}-600 text-2xl flex justify-center items-center font-semibold text-white font-mono hover:bg-${theme}-500`}>Resign</button>
        </a></div>}
        {stockfishRole && <div className='flex' ><a href="/">
          <button onClick={handleResign} className={`border-2 border-white rounded-2xl w-28 h-16 ml-4 bg-${theme}-600 text-2xl flex justify-center items-center font-semibold text-white font-mono hover:bg-${theme}-500`}>Abort</button>
        </a></div>}
      </div>
      <div className={`h-3/5 bg-slate-800 m-2 rounded-xl border-2 border-${theme}-700 flex flex-col p-4 text-white font-medium overflow-y-auto overflow-x-hidden hide-scrollbar`}>
        <div className={`h-max w-full text-white font-thin text-2xl underline underline-offset-4 text-center mb-3 hover:text-${theme}-600`}>Move History</div>
        {renderHistory()}
      </div>
      <div className={`h-24 bg-slate-800 m-1 mb-4 rounded-xl border-2 border-${theme}-700 flex flex-col p-2 text-white font-medium justify-around overflow-auto hide-scrollbar`}>
        <div className='flex justify-start items-center h-20 w-full' >{BlackKills.map((p,i)=>{
          return <img key={i} className='h-10 w-10 ' src={pieces[p]} ></img>
        })}</div>
        <div className='flex justify-start h-20 w-full' >{WhiteKills.map((p,i)=>{
          return <img key={i} className='h-10 w-10 '  src={pieces[p]} ></img>
        })}</div>
      </div>
    </div>
  );
}

export default ControlPanel;
