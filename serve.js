// import express from "express";
// import http from "http";
// import cors from 'cors';

const express = require("express");
const http = require("http");
const cors = require("cors");
// import WebSocket,{WebSocketServer} from "ws";
// import {Server, Socket} from 'socket.io'; 


const app = express();
// const uri = "http://localhost:8081";
const uri = "*";

// app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("change"));
 


const httpServer = http.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: uri,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

//setting cors 
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", uri);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//connection event handler
io.on('connection' , function(socket) {
    // console.log("someone Join");
    // console.log(io.sockets.adapter.rooms);
    console.log(io.sockets.adapter);

    socket.on('enter_room', (roomName,showRoom) => {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit("welcome");
        // console.log(socket.to(roomName));
    });
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

})

const handleListen = () => console.log("Listening on 9000");
httpServer.listen(9000, handleListen);
