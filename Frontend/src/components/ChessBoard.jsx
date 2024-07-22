import React, { useEffect, useState } from 'react'
import { Chess } from 'chess.js';
import ChessBoardFiles from './ChessBoardFiles';
import ChessBoardRanks from './ChessBoardRanks';
import Pieces from './Pieces';



const kills = [];


function ChessBoard({chess,board,socket,room,playerRole,playerNo,stockfishRole,theme,gameOver,turn,chessMove}) {
    // console.log("board is : ",board)
    // console.log("player is", playerRole)
    let [possibleMoves,setPossibleMoves] = useState([]);
    let [clickSource, setClickSource] = useState('');
    useEffect(()=>{
        // console.log(chessMove,'move');
    },[chessMove])

    let getPiece = (rank,file)=>{
        let fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
        let Square = board[8-rank][fileIndex];
        return Square ? <Pieces square = {Square} rank = {rank} file = {file} /> : null;
    };
    // console.log("Board is", chessBoard)
    const getSquareColor = (i,j,file,rank) =>{
        let color = 'white';
        color =  (i+j)%2 !==0 ? `bg-${theme}-700` : 'bg-white';
        if(possibleMoves.includes(`${file}${rank}`)) color = `bg-${theme}-500`;
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
    const decodeMove = (move)=>{
        let len = move.length
        if(move[len-1] === '+') return `${move[len-3]}${move[len-2]}`
        if(len===2) return `${move[0]}${move[1]}`
        if(len===3) return `${move[1]}${move[2]}`
        if(len===4) return `${move[2]}${move[3]}`
    }
    const onClick = (e)=>{
        
        let source = '',target = '';
        if(clickSource !== '' && (possibleMoves.includes(e.target.getAttribute('data-sq')) || possibleMoves.includes(e.target.parentNode.parentNode.getAttribute('data-sq')))){
            target = e.target.getAttribute('data-sq') || e.target.parentNode.parentNode.getAttribute('data-sq');
            handleMove(clickSource,target);
            if(turn === playerRole || stockfishRole ) checkKill(target);
            setPossibleMoves([clickSource,target]);
            setClickSource('');
            return;
        }
        if(e.target.parentNode.parentNode) source = e.target.parentNode.parentNode.getAttribute('data-sq');
        if(!source){
            setPossibleMoves([]);
            setClickSource('');
            return;
        }
        setClickSource(source);
        let moves = [];
        // console.log(chess.moves({square:source}))
        chess.moves({square:source}).map((pos,i)=>{
            // console.log(decodeMove(pos));
            moves.push(decodeMove(pos));
        })
        if(chess.moves({square:source}).includes('O-O') && playerRole==='b'){
            moves.push('g8');
        }
        if(chess.moves({square:source}).includes('O-O') && playerRole==='w'){
            moves.push('g1');
        }
        if(chess.moves({square:source}).includes('O-O-O') && playerRole==='w'){
            moves.push('c1');
        }
        if(chess.moves({square:source}).includes('O-O-O') && playerRole==='b'){
            moves.push('c8');
        }
        setPossibleMoves(moves);
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
                                onClick={onClick}
                                draggable = 'false' 
                                key = {file+'-'+rank} className = {` ${playerRole ==='b' ? 'rotate-180' : 'rotate 0'} ${getSquareColor(i,j,file,rank)} piece flex justify-center items-center`} > 
                                
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