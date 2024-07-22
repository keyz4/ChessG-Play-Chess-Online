import React, { useEffect, useCallback, useState } from 'react'
import io from 'socket.io-client'
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import ChatBox from './ChatBox';
import ControlPanel from './ControlPanel';
import { baseUrl } from '../js/baseURL';


const socket  = io.connect(`${baseUrl}`);
const stockfish = new Worker('/stockfish/src/stockfish.js');
// console.log(stockfish);
const chess = new Chess();
let gameFen  = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function sendCommand(command) {
  stockfish.postMessage(command);
}

sendCommand('uci');

function PlayStockofish() {
  
  let [playerRole, setPlayerRole] = useState('w');
  let [stockfishRole, setStockfishRole] = useState('b');
  let [room, setRoom] = useState(0);
  let [playerNo, setPlayerNo] = useState(0);
  let [board, setBoard] = useState(chess.board());
  let [theme, setTheme] = useState('lime') // lime amber emerald violet slate pink
  let [draw, setDraw] = useState(false);
  let [checkmate, setCheckmate] = useState(false);
  let [stalemate, setStalemate] = useState(false);
  let [threefold_repetition, setThreefold_repetition] = useState(false);
  let [insufficient_material, setInsufficient_material] = useState(false);
  let [check, setCheck] = useState(false);
  let [gameOver, setGameOver] = useState(false);
  let [text, setText] = useState('');
  let [ok, setOk] = useState(true);
  let [drawOffer, setDrawOffer] = useState(false);
  let [BlackKills,setBlackKills] = useState([]);
  let [WhiteKills,setWhiteKills] = useState([]);
  let [loading, setLoading] = useState(true);

  const setNewTheme = useCallback(()=>{
    setTheme('lime')
  },[]);
  useEffect(()=>{
    setNewTheme();
  },[])

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

  stockfish.onmessage = function(event) {
    const message = event.data;
   
    if (message === 'uciok') {
        sendCommand('ucinewgame');
        sendCommand('setoption name Skill Level value 20');
        sendCommand('setoption name MultiPV value 1');
        sendCommand('setoption name Hash value 1024');
        sendCommand('setoption name Threads value 4');
        sendCommand('setoption name Contempt value 0');
        sendCommand('setoption name Ponder value true');
        sendCommand('d');
    }
    if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        socket.emit("stockfishMove", { bestMove, room, stockfishRole, playerRole });
    }
  };

  useEffect(() => {
    socket.emit('stockfish_game');
    socket.on("playerJoined_sf", (sf_playerCount) => {
      const currentRoom = sf_playerCount;
      const currentPlayerNo = sf_playerCount % 2 === 0 ? 2 : 1;
      setRoom(currentRoom);
      setPlayerNo(currentPlayerNo);
      console.log(`Player ${currentPlayerNo} just joined room ${currentRoom}`);
      socket.emit("giveRole_to_sf", currentPlayerNo);
    });

    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      setStockfishRole(role === 'w' ? 'b' : 'w');
      setLoading(false);
    });

    socket.on("move", (move) => {
      chess.move(move);
      setBoard([...chess.board()]);
      checkStatus();
    });

    socket.on("boardState", (fen) => {
      gameFen = fen;
      chess.load(fen);
      setBoard([...chess.board()]);
    });

    socket.on("stockfishMove", (fen) => {
      sendCommand(`position fen ${fen}`);
      sendCommand('go depth 15');
    });
    
    socket.on('blackKill',({kills})=>{
      setBlackKills(kills);
      console.log('black kills ',kills)
      
    })
    socket.on('whiteKill',({kills})=>{
      setWhiteKills(kills);
      console.log('white kills ',kills)
      
    })

    return () => {
      socket.off("playerJoined_sf");
      socket.off("playerRole");
      socket.off("move");
      socket.off("boardState");
      socket.off("stockfishMove");
    };
  }, []);

  const handleBack = ()=>{
    setText('');
    setOk(true);
  }
  if (loading) {
    return (
        <div className='w-screen h-screen flex justify-center items-center bg-slate-900'>
            <div className='loader-wrapper'>
                <div className='loader'>
                    <div></div>
                </div>
                <div className='text-3xl font-bold text-white mt-4'>Loading...</div>
            </div>
        </div>
    );
  }

  if(!loading) {
    return (
      <>
        <div className='flex flex-col-reverse md:flex-row h-max md:h-screen justify-center items-center bg-slate-900'>
          <div className="util h-[40rem] w-full md:h-full md:w-2/5 bg-slate-900 flex flex-col justify-center items-center ">
            <ControlPanel theme={theme} socket={socket} room={room}  WhiteKills={WhiteKills} BlackKills={BlackKills} stockfishRole={stockfishRole} />
          </div>
          <ChessBoard 
            chess={chess}
            board={board} 
            socket={socket} 
            room={room} 
            playerRole={playerRole}
            playerNo={playerNo}
            stockfishRole={stockfishRole}
            theme={theme}
          />
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
    );
  }
}

export default PlayStockofish;
