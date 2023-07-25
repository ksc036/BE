// import express from "express";
// import http from "http";
// import cors from 'cors';

const express = require("express");
const https = require("https");
const cors = require("cors");
// import WebSocket,{WebSocketServer} from "ws";
// import {Server, Socket} from 'socket.io'; 


const app = express();
// const uri = "http://localhost:8081";
const uri = "*";

// app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("change"));
 


const httpServer = https.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: uri,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

app.use(cors({
    origin: '*',
    // 다른 옵션들을 필요에 따라 설정할 수 있습니다.
  }));
  
//setting cors 
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", uri);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
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

const handleListen = () => console.log("Listening on 3060");
httpServer.listen(3060, handleListen);
