import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import ChatBox from './ChatBox';
import ControlPanel from './ControlPanel';
import { baseUrl } from '../js/baseURL';



const socket  = io.connect(`${baseUrl}`);
const chess = new Chess();
// let board = chess.board();



function PlayOnline() {
  
  let [playerRole, setPlayerRole] = useState('w');
  let [room, setRoom] = useState(0);
  let [playerNo, setPlayerNo] = useState(0);
  let [board, setBoard] = useState(chess.board());
  let [theme, setTheme] = useState('pink') // lime amber emerald violet slate blue green purple
  let [draw, setDraw] = useState(false);
  let [checkmate, setCheckmate] = useState(false);
  let [stalemate, setStalemate] = useState(false);
  let [threefold_repetition, setThreefold_repetition] = useState(false);
  let [insufficient_material, setInsufficient_material] = useState(false);
  let [check, setCheck] = useState(false);
  let [gameOver, setGameOver] = useState(false);
  let [text, setText] = useState('');
  let [ok, setOk] = useState(true);
  let [drawOffer, setDrawOffer] = useState(false)
  let [BlackKills,setBlackKills] = useState([]);
  let [WhiteKills,setWhiteKills] = useState([]);
  let [chessMove, setChessMove] = useState(null);

  function checkStatus(){
    
    if (chess.isCheckmate()) {
      setText('Checkmate!');
      setCheckmate(true);
      setOk(false);
    } else if (chess.isStalemate()) {
        setText('Draw due to Stalemate!');
        setStalemate(true);
        setOk(false);
    } else if (chess.isInsufficientMaterial()) {
        setText('Draw due to Insufficient Material!');
        setInsufficient_material(true);
        setOk(false);
    } else if (chess.isThreefoldRepetition()) {
        setText('Draw due to Threefold Repetition!');
        setThreefold_repetition(true);
        setOk(false);
    } else if (chess.isDraw()) {
        setText('Draw');
        setDraw(true);
        setOk(false);
    } else if (chess.inCheck()) {
        setCheck(true);
    }else if(chess.isGameOver()) {
      setGameOver(true);
    } else{
      if(draw) setGameOver(true)
    }
  }

  const handleBack = ()=>{
    setText('');
    setOk(true);
  }

  const makeDraw = ()=>{
    setDrawOffer(false);
    setText('Draw');
    setDraw(true);
    setOk(false);
    setGameOver(true);
    checkStatus();
  }

  const acceptDraw = ()=>{
    socket.emit('drawAccepted',{room})
    setDrawOffer(false);
    setText('Draw');
    setDraw(true);
    setOk(false);
    setGameOver(true);
    checkStatus();
  }
  const rejectDraw = ()=>{
    setDrawOffer(false);
    setDraw(false);
    setOk(true);
  }

  useEffect(()=>{
    socket.emit("pvp_game");
    socket.on("playerJoined",({playerCount,roomNo})=>{
      room = roomNo;
      setRoom(room);
      playerNo = playerCount%2===0 ? 2 : 1;
      setPlayerNo(playerNo);
      console.log(`Player ${playerNo} just joined room ${roomNo}`);
      socket.emit("giveRole",{playerNo,roomNo});
    });

    socket.on("playerRole",(role)=>{
      setPlayerRole(role);
      console.log("player role : ", role);
    });

    socket.on("move",(move)=>{
      console.log("move is ",move);
      setChessMove(move);
      chess.move(move);
      setBoard([...chess.board()]);
      checkStatus();
      // console.log("new board1 : ",chess.board())
      
    });
    socket.on("boardState",(fen)=>{
      // gameFen = fen;
      chess.load(fen);
      setBoard([...chess.board()]);
      // console.log("new board2 : ",chess.board())
      // console.log(chess.fen());
    });

    socket.on('drawOffer',()=>{
      setText('Opponent offered a draw')
      setDrawOffer(true);
      setOk(false);
    })
    socket.on('resigned',()=>{
      setText('Opponent Resigned');
      setGameOver(true);
      setOk(false);
    })

    socket.on('drawed',()=>{
      makeDraw();
    })
    socket.on('blackKill',({kills})=>{
      setBlackKills(kills);
      console.log('black kills ',kills)
      
    })
    socket.on('whiteKill',({kills})=>{
      setWhiteKills(kills);
      console.log('white kills ',kills)
      
    })
  },[]);

  useEffect(() => {
    console.log('chessMove:', chessMove);
  }, [chessMove]);

  return (
    <>
      <div className='relative flex flex-col-reverse md:flex-row h-max md:h-screen w-screen justify-center items-center bg-slate-900'>
        <div className="util h-[40rem] md:h-full md:w-2/5 w-full bg-slate-900 flex flex-col justify-center items-center ">
          <ControlPanel theme={theme} socket={socket} room={room}  WhiteKills={WhiteKills} BlackKills={BlackKills} stockfishRole={false} />
        </div>
        <ChessBoard 
          chessMove={chessMove}
          turn={chess.turn()}
          board={board} 
          socket = {socket} 
          room={room} 
          playerRole={playerRole}
          playerNo={playerNo}
          theme={theme}
          gameOver={gameOver}/>
          <ChatBox theme={theme} room={room} socket={socket} />
          { !ok && <div className={` h-screen w-screen absolute left-0 top-0 flex justify-center items-center bg-white bg-opacity-50`} >
              <div className='h-[15rem] w-[30rem] flex flex-col justify-between items-center bg-slate-800 rounded-xl ' >
                <div className='w-full h-full text-white flex justify-center items-center text-3xl font-serif' >{text}</div>
                <div className='w-full h-max flex justify-center items-center my-4' > 
                  <button onClick={drawOffer ? rejectDraw : handleBack} className= 'w-40 h-10 rounded-3xl text-2xl flex justify-center items-center font-mono border-2 text-white mr-4 hover:text-slate-950 hover:bg-white'  >{drawOffer? 'Reject' :'Back'}</button>
                  {!drawOffer && <a href="/">
                    <button className= 'w-40 h-10 rounded-3xl text-2xl flex justify-center items-center font-mono border-2 text-white ml-4 hover:text-slate-950 hover:bg-white'  >Exit</button>
                  </a>}
                  {drawOffer && <button onClick={acceptDraw} className= 'w-40 h-10 rounded-3xl text-2xl flex justify-center items-center font-mono border-2 text-white ml-4 hover:text-slate-950 hover:bg-white'  >Accept</button>}
                </div>
              </div>
          </div>}
      </div>
    </>
  )
}

export default PlayOnline


