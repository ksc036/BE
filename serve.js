import express from "express";
import http from "http";
import cors from 'cors';

// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// import WebSocket,{WebSocketServer} from "ws";
import {Server, Socket} from 'socket.io'; 


const app = express();

app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("change"));
 


const httpServer = http.createServer(app);
const wsServer = new Server(httpServer,{
    cors:{
        origin :  'http://localhost:8080',
        // methods : ["GET", "POST"],
        credentials : true
    }
});

// var io = require('socket.io')(httpServer);

//setting cors 
// app.all('/*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });

//connection event handler
// io.on('connection' , function(socket) {
//     console.log('Connect from Client: '+socket)

//     socket.on('chat', function(data){
//         console.log('message from Client: '+data.message)

//         var rtnMessage = {
//             message: data.message
//         };

//         // 클라이언트에게 메시지를 전송한다
//         socket.broadcast.emit('chat', rtnMessage);
//     });

// })

const handleListen = () => console.log("Listening on 9000");
httpServer.listen(9000, handleListen);


//webSocket

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
