import React, { useEffect, useState } from 'react'
import { Chess } from 'chess.js';
import ChessBoardFiles from './ChessBoardFiles';
import ChessBoardRanks from './ChessBoardRanks';
import Pieces from './Pieces';
const chess = new Chess();


const kills = [];


function ChessBoard({board,socket,room,playerRole,playerNo,stockfishRole,theme,gameOver,turn,chessMove}) {
    // console.log("board is : ",board)
    // console.log("player is", playerRole)
    useEffect(()=>{
        console.log(chessMove,'move');
    },[chessMove])

    let getPiece = (rank,file)=>{
        let fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
        let Square = board[8-rank][fileIndex];
        return Square ? <Pieces square = {Square} rank = {rank} file = {file} /> : null;
    };
    // console.log("Board is", chessBoard)
    const getSquareColor = (i,j) =>{
        let color = 'white';
        color =  (i+j)%2 !==0 ? `bg-${theme}-700` : 'bg-white';
        return color;
    }
    const handleMove = (source,target)=>{
        // console.log(source,target);
        
        if(gameOver) return;
        const move = {
            from: `${source}`,
            to: `${target}`,
            promotion: 'q'
        };
        // console.log("in handleMove",move,room,playerRole);
        if(stockfishRole)socket.emit("move_sf",{move,room,playerRole});
        socket.emit("move",{move,room,playerNo});
    };
    const ranks = Array(8).fill().map((x,i)=> 8-i);
    const files = Array(8).fill().map((x,i)=> String.fromCharCode(i+97));

    const checkKill= (target)=>{
        if(target){
            let rank = Number([target[1]]);
            let file = Number(target[0].charCodeAt(0) - 'a'.charCodeAt(0));
            let Square = board[8-rank][file];
            if(Square && Square.color != playerRole) {
                kills.push(`${Square.type}${Square.color}`);
                if(playerRole === 'w') socket.emit('Blackkilled',{room,kills});
                if(playerRole === 'b') socket.emit('Whitekilled',{room,kills});
        }
        }
    }

    const onDrop = (e)=>{
        
        let [piece,rank,file] = e.dataTransfer.getData('text').split(',');
        let target = e.target.getAttribute('data-sq') ? e.target.getAttribute('data-sq') :e.target.parentNode.parentNode.getAttribute('data-sq') ;
        let source = `${file}${rank}`;
        handleMove(source,target);
        if(turn === playerRole || stockfishRole ) checkKill(target);
    }

    const onDragOver = (e)=>{
        e.preventDefault();
    }
  return (
    <>
        <div className={`chesssBoard flex-col w-[90%] md:h-[95%] aspect-square items-center p-4 mr-8 my-4  md:w-max`} >
                <div className='h-full w-full flex'>
                    <ChessBoardRanks player ={playerRole} ></ChessBoardRanks>
                    <div className={`board ${playerRole ==='b' ? 'rotate-180' : 'rotate 0'} text-slate-400 grid grid-rows-8 grid-cols-8 h-full aspect-square border-4 border-slate-300`}>
                        {ranks.map((rank,i)=>
                            files.map((file,j)=>
                                <div 
                                data-sq = {`${file}${rank}`}
                                onDrop={onDrop}
                                onDragOver={onDragOver} 
                                draggable = 'false' 
                                key = {file+'-'+rank} className = {` ${playerRole ==='b' ? 'rotate-180' : 'rotate 0'} ${getSquareColor(i,j)} piece flex justify-center items-center`} > 
                                
                                {getPiece(rank,file)}

                                </div>))}
                    </div>
                </div>
                <div className="w-full">
                    <ChessBoardFiles player ={playerRole} ></ChessBoardFiles>
                </div>
            </div>
    </>
  )
}

export default ChessBoard