const {Chess} = require("chess.js");

const start_sf_game = (playerCount,socket,sf_games,sf_rooms,io)=>{
    playerCount++;
    let room = playerCount;
    console.log(`player ${playerCount} entered stockfish mode`);
    socket.join(room);
    let sf_game = new Chess();
    sf_games[room] = sf_game;

    if(!sf_rooms.includes(room)) sf_rooms.push(room);   
    io.to(room).emit("playerJoined_sf",room);

    return playerCount;
}
const giveRole_sf = (player,socket)=>{
    let playerRole = null;
    if(player===1){
        playerRole = 'w';
        stockfishRole = 'b';
    }else{
        playerRole = 'b';
        stockfishRole = 'w';
    }
    socket.emit("playerRole",playerRole)
    return stockfishRole;
};

const makeMove_sf = (move,room, playerRole,io,sf_game)=>{
    try{
        if(sf_game.turn() !== playerRole) return;
        if(sf_game.turn() !== playerRole) return;

        const result = sf_game.move(move);
        if(result){
            // console.log(sf_game.history());
            io.to(room).emit("move",move);
            io.to(room).emit("boardState",sf_game.fen());
            io.to(room).emit("stockfishMove",sf_game.fen());
            io.to(room).emit("game_history",sf_game.history());
        }else{
            console.log("Invalid Move : ",move);
            io.to(room).emit("Invalid Move : ",move);
        }
    }catch(error){
        console.log(error);
        io.to(room).emit("Invalid Move : ",move);
    }
};

const message_handler = (message, socket, room) => {
    socket.emit('message_recieved', { message: message, sendBy: 0 });
    socket.to(room).emit('message_recieved', { message: message, sendBy: 1 });
};


module.exports = { giveRole_sf ,makeMove_sf,start_sf_game,message_handler};

