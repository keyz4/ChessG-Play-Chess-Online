const {Chess} = require("chess.js");

const start_online_game = (playerCount, socket,rooms,games)=>{
    console.log("user connected : ", socket.id);
    playerCount++;
    let roomNo = (Math.round(playerCount/2))*1000;
    socket.join(roomNo);
    socket.emit("playerJoined",{playerCount,roomNo});
    console.log(playerCount, roomNo);
    let game;
    if(!rooms.includes(roomNo)){
        game = new Chess();
        games[roomNo] = game;
    }else{
        game = games[roomNo];
    }
    if(!rooms.includes(roomNo)) rooms.push(roomNo);
    console.log(`rooms : ${rooms}`);
    return [playerCount,roomNo];
}

const giveRole_online = (player,socket,room)=>{
    let playerRole = null;

    if(player===1){
        playerRole = 'w';
    }else{
        playerRole = 'b';
    }
    
    socket.emit("playerRole",playerRole)
};


const makeMove_online = (move,room,playerNo,game,io)=>{

    try{
        if(game.turn()==="w" && playerNo !== 1) return;
        if(game.turn()==="b" && playerNo !== 2) return;

        const result = game.move(move);
        if(result){
            io.to(room).emit("move",move);
            io.to(room).emit("boardState",game.fen());
            io.to(room).emit("game_history",game.history());
        }else{
            
            io.to(room).emit("Invalid Move : ",move);
        }
    }catch(error){
        console.log(error);
        io.to(room).emit("Invalid Move : ",move);
    }
}

const message_handler = (message, socket, room) => {
    socket.emit('message_recieved', { message: message, sendBy: 0 });
    socket.to(room).emit('message_recieved', { message: message, sendBy: 1 });
};
  
        

module.exports = {start_online_game,giveRole_online,makeMove_online,message_handler}