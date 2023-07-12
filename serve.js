// import express from "express";
// import http from "http";
// import cors from 'cors';

const express = require("express");
const http = require("http");
const cors = require("cors");
// import WebSocket,{WebSocketServer} from "ws";
// import {Server, Socket} from 'socket.io'; 


const app = express();

// app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("change"));
 


const httpServer = http.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

//setting cors 
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//connection event handler
io.on('connection' , function(socket) {
    console.log("someone Join");
    socket.on('enter_room', (roomName,showRoom) => {
        console.log(roomName);
        showRoom();
        socket.to(roomName).emit("welcome");
    });

})

const handleListen = () => console.log("Listening on 9000");
httpServer.listen(9000, handleListen);
// const wsServer = new Server(httpServer,{
//     cors:{
//         origin :  'http://localhost:8080',
//         // methods : ["GET", "POST"],
//         credentials : true
//     }
// });

// wsServer.on("conntection", socket =>{
//     console.log(socket);
// })
// const wss = new WebSocketServer({server});
// wss.on("connection",(socket) =>{
// console.log("Connected to Browser");
//    socket.send("hello!!!");

//    socket.on("close", ()=>{
//     console.log("연결하나 끊어짐");
//    })

//    socket.on("message",(data)=>{
//     console.log(data.toString());
//    })
// });
