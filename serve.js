const express = require("express");
const http = require("http");
const cors = require("cors");


const app = express();
const uri = "http://localhost:3060";
const port = 4060;
//setting cors 
app.use(cors({
    origin: uri,
    credentials: true
  }));

app.all('/*', function(req, res, next) {
    console.log(res);
    res.header("Access-Control-Allow-Origin", uri);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get("/",(req,res) =>{
     res.send("changeㄴ")});

const httpServer = http.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: uri,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true,
    transportOptions: {
        polling: {
            extraHeaders: { // Polling transport의 헤더 설정
                "Access-Control-Allow-Origin": uri,
                "Access-Control-Allow-Headers": "X-Requested-With"// 예: 토큰 기반 인증 헤더 추가
              }
        },
        websocket: {
          extraHeaders: { // WebSocket transport의 헤더 설정
            "Access-Control-Allow-Origin": uri,
            "Access-Control-Allow-Headers": "X-Requested-With"// 예: 토큰 기반 인증 헤더 추가
          }
        }
      }
});





//connection event handler
io.on('connection' , function(socket) {
    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        // done();
        socket.to(roomName).emit("welcome");
    });

    socket.on("offer",(offer,roomName)=>{
        socket.to(roomName).emit("offer", offer);
    })

    socket.on("answer",(answer, roomName)=>{
        socket.to(roomName).emit("answer",answer);
    })

    socket.on('new_message', (roomName,nickname,message,done) => {
        // console.log(roomName);
        socket.to(roomName).emit("new_message",nickname,message);
        done(message);
    });
    socket.on("disconnecting", () =>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye");
        });
    })
    socket.on("ice",(ice,roomName) =>{
        socket.to(roomName).emit("ice",ice);
    })
})

const handleListen = () => console.log(`Listening on ${port}`);
httpServer.listen(port, handleListen);
// httpServer.listen(port,handleListen);
//팀테스트 마침