const express = require("express");
const http = require("http");
const socket = require("socket.io");
const {Chess} = require("chess.js");
const path = require("path");
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});
const { giveRole_sf,makeMove_sf, start_sf_game } = require("./public/js/playStockfish.js");
const { start_online_game, giveRole_online, makeMove_online, message_handler } = require("./public/js/playOnline.js");
const blogs = require('./routes/rss_parser.js');
const PORT = process.env.PORT || 3000;


app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
}));
app.use('/blogs',blogs);

// variables for online game
let game = {};
let games = [];
let rooms = [];
let playerCount = 0;
let currentPlayer = "w";

// variables for stockfish game

let sf_rooms = [];
let sf_games = [];
let currentPlayer_sf = "w";
let sf_playerCount = 0;
let stockfishRole ;



io.on("connection",(uniqueSocket)=>{
    uniqueSocket.on("pvp_game",()=>{
        [playerCount,roomNo] = start_online_game(playerCount,uniqueSocket,rooms,games);
        uniqueSocket.on("giveRole",({playerNo,roomNo})=>{
            giveRole_online(playerNo,uniqueSocket,roomNo);
        });

        uniqueSocket.on("move",({move,room,playerNo})=>{
            game = games[room];
            makeMove_online(move,room,playerNo,game,io);
        });
    });
    uniqueSocket.on("player_message", ({msg,room}) => {
        console.log('player message received');
        message_handler(msg, uniqueSocket, room);
      });

    uniqueSocket.on('draw',({room})=>{
        uniqueSocket.to(room).emit('drawOffer');
    })
    uniqueSocket.on('resign',({room})=>{
        // uniqueSocket.emit('resigned',1);
        uniqueSocket.to(room).emit('resigned');
    })
    uniqueSocket.on('drawAccepted',({room})=>{
        uniqueSocket.to(room).emit('drawed');
    })
    uniqueSocket.on('Blackkilled',({room,kills})=>{
        uniqueSocket.emit('blackKill',{kills});
        uniqueSocket.to(room).emit('blackKill',{kills});
    })
    uniqueSocket.on('Whitekilled',({room,kills})=>{
        uniqueSocket.emit('whiteKill',{kills});
        uniqueSocket.to(room).emit('whiteKill',{kills});
    })

    uniqueSocket.on("stockfish_game",()=>{

        sf_playerCount = start_sf_game(sf_playerCount,uniqueSocket,sf_games,sf_rooms,io);
        let sf_game = sf_games[sf_playerCount];

        uniqueSocket.on("giveRole_to_sf",(sf_player)=>{
            stockfishRole = giveRole_sf(sf_player,uniqueSocket);
            currentPlayer_sf = sf_game.turn();
            if(currentPlayer_sf===stockfishRole){
                io.to(sf_playerCount).emit("stockfishMove",sf_game.fen());
            }
        });
        
        uniqueSocket.on("move_sf",({move,room,playerRole})=>{
            makeMove_sf(move,room,playerRole,io,sf_game);
        });

        uniqueSocket.on("stockfishMove",({bestMove,room,stockfishRole,playerRole})=>{
            makeMove_sf(bestMove,room,stockfishRole,io,sf_game);
        })
    });
});


server.listen(PORT,()=>{
    console.log("server listening on port 3000");
});