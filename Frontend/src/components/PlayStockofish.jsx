import React, { useEffect, useCallback, useState } from 'react'
import io from 'socket.io-client'
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import ChatBox from './ChatBox';
import ControlPanel from './ControlPanel';

const socket  = io.connect('https://chessg-play-chess-online.onrender.com/');

const stockfish = new Worker('node_modules/stockfish/src/stockfish.js');
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
  let [BlackKills,setBlackKills] = useState([]);
  let [WhiteKills,setWhiteKills] = useState([]);
  const setNewTheme = useCallback(()=>{
    setTheme('lime')
  },[]);
  useEffect(()=>{
    setNewTheme();
  },[])
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
    });

    socket.on("move", (move) => {
      chess.move(move);
      setBoard([...chess.board()]);
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

  return (
    <>
      <div className='flex h-screen justify-center items-center bg-slate-900'>
        <div className="util h-full w-2/5 bg-slate-900 flex flex-col justify-center items-center ">
          <ControlPanel theme={theme} socket={socket} room={room}  WhiteKills={WhiteKills} BlackKills={BlackKills} />
        </div>
        <ChessBoard 
          board={board} 
          socket={socket} 
          room={room} 
          playerRole={playerRole}
          playerNo={playerNo}
          stockfishRole={stockfishRole}
          theme={theme}
        />
          <ChatBox theme={theme} room={room} socket={socket} />
      </div>
    </>
  );
}

export default PlayStockofish;
