const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");
const { title } = require("process");
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }));

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});
// const chess = new Chess();
let games = [];
let rooms = [];
let sf_rooms = [];
let sf_games = [];
let currentPlayer = "w";
let currentPlayer_sf = "w";

let playerCount = 0;
let sf_playerCount = 0;
let stockfishRole ;


const blogs = require('./rss_parser');

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/blogs',blogs);


app.get("/",(req,res)=>{
    res.render("index",{title: "ChessGame"});
});
app.get("/stockfish",(req,res)=>{
    res.render("stockfish",{title: "ChessGame"});
});
// socket --------------

// io.on("connection",(uniqueSocket)=>{
//     console.log("conected");
//     uniqueSocket.on("hello",()=>{
//         io.emit("hello 2")
//     });
//     uniqueSocket.on("disconnect",()=>{
//         console.log("disconnected")
//     })
// });

io.on("connection",(uniqueSocket)=>{
    uniqueSocket.on("pvp_game",()=>{
        console.log("user connected : ", uniqueSocket.id);
        let game;
        playerCount++;
        let roomNo = (Math.round(playerCount/2))*10000;
        uniqueSocket.join(roomNo);
        uniqueSocket.emit("playerJoined",{playerCount,roomNo});
        console.log(playerCount, roomNo);
        if(!rooms.includes(roomNo)){
            game = new Chess();
            games[roomNo] = game;
        }else{
            game = games[roomNo];
        }
        if(!rooms.includes(roomNo)) rooms.push(roomNo);
        console.log(`rooms : ${rooms}`);
        // console.log(game);
        uniqueSocket.on("giveRole",({playerNo,roomNo})=>{
            if(playerNo===1){
                // players.white = uniqueSocket.id;
                uniqueSocket.emit("playerRole","w");
            } else if(playerNo===2){
                // players.black = uniqueSocket.id;
                uniqueSocket.emit("playerRole","b");
            }
        });

        uniqueSocket.on("move",({move,room,playerNo})=>{
            try{
                // console.log("game fen before : ",game.fen())
                // console.log(`player : ${playerNo}`)
                if(game.turn()==="w" && playerNo !== 1) return;
                if(game.turn()==="b" && playerNo !== 2) return;
                
                const result = game.move(move);
                // console.log("game fen after : ",game.fen())
                // console.log("result : ",result);
                if(result){
                    currentPlayer = game.turn();
                    io.to(room).emit("move",move);
                    io.to(room).emit("boardState",game.fen());
                }else{
                    // console.log("Invalid Move : ",move);
                    io.to(room).emit("Invalid Move : ",move);
                }
            }
            catch(err) {
                console.log(err);
                io.to(room).emit("Invalid Move : ",move);
            }
        });
    });

    uniqueSocket.on("stockfish_game",()=>{
        sf_playerCount++;
        console.log(`player ${sf_playerCount} entered stockfish mode`);
        uniqueSocket.join(sf_playerCount);
        let sf_game = new Chess();
        sf_games[sf_playerCount] = sf_game;
        if(!sf_rooms.includes(sf_playerCount)) sf_rooms.push(sf_playerCount);
        // console.log(`sf_rooms : ${sf_rooms}`);
        io.to(sf_playerCount).emit("playerJoined_sf",sf_playerCount);
        uniqueSocket.on("giveRole_to_sf",(sf_player)=>{
            if(sf_player===1){
                // players.white = uniqueSocket.id;
                uniqueSocket.emit("playerRole","w");
                stockfishRole = "b";
            } else if(sf_player===2){
                // players.black = uniqueSocket.id;
                uniqueSocket.emit("playerRole","b");
                stockfishRole = "w";
            }
            currentPlayer_sf = sf_game.turn();
            // console.log(currentPlayer_sf,stockfishRole);
            if(currentPlayer_sf===stockfishRole){
                io.to(sf_playerCount).emit("stockfishMove",sf_game.fen());
            }
        });
        
        uniqueSocket.on("move_sf",({move,room,playerRole})=>{
            try{
                // console.log("game fen before : ",sf_game.fen())
                // console.log(`player : ${playerRole}`)
                if(sf_game.turn() !== playerRole) return;
                if(sf_game.turn() !== playerRole) return;
                
                const result = sf_game.move(move);
                // console.log("game fen after : ",sf_game.fen())
                // console.log("result : ",result);
                if(result){
                    io.to(room).emit("move",move);
                    io.to(room).emit("boardState",sf_game.fen());
                    io.to(room).emit("stockfishMove",sf_game.fen());
                }else{
                    console.log("Invalid Move : ",move);
                    io.to(room).emit("Invalid Move : ",move);
                }
            }
            catch(err) {
                console.log(err);
                io.to(room).emit("Invalid Move : ",move);
            }
        });

        uniqueSocket.on("stockfishMove",({bestMove,room,stockfishRole,playerRole})=>{
            // console.log("here in stockfish",bestMove,room,stockfishRole);
            // console.log("bool2 : ",sf_game.turn() !== stockfishRole);
            try{
                if(sf_game.turn() !== stockfishRole) return;
                if(sf_game.turn() !== stockfishRole) return;
                const result = sf_game.move(bestMove);
                if(result){
                    currentPlayer = sf_game.turn();
                    io.to(room).emit("move",bestMove);
                    io.to(room).emit("boardState",sf_game.fen());
                    currentPlayer_sf = sf_game.turn();
                    // console.log("bool : " , playerRole !== stockfishRole);
                }else{
                    console.log("Invalid Move : ",move);
                    io.to(room).emit("Invalid Move : ",move);
                }

            }catch(err){
                console.log(err);
                io.to(room).emit("Invalid Move : ",move);
            }
        })
    });
});


server.listen(PORT,()=>{
    console.log("server listening on port 3000");
});