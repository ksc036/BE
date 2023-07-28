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
const uri = "http://localhost:8081";

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
    allowEIO3: true,
});

//setting cors 
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", uri);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//로컬최종
let users ={};
let socketToRoom ={};
//connection event handler
io.on('connection' , function(socket) {
    socket.on('join_room', (data) => {
        if(users[data.roomName]){
            users[data.roomName].push({id:socket.id, nickname : data.nickname})
        }else{ //없으면 data.roomName
            users[data.roomName] = [{id:socket.id, nickname : data.nickname}];
        }
        socketToRoom[socket.id] = data.roomName;
        socket.join(data.roomName);
        //  console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);
        console.log(users);
        //나갈때 잘 지워줘야겠다.
         const usersInThisRoom = users[data.roomName].filter(user => user.id !== socket.id)
        io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
    });

    socket.on("offer",(data)=>{
        console.log(data.offerReceiveID);
        socket.to(data.offerReceiveID).emit("getOffer", data);
    })

    socket.on("answer",(data)=>{
        socket.to(data.answerReceiveID).emit("getAnswer",data);
    })

    socket.on("candidate",(data) =>{
        socket.to(data.candidateReceiveID).emit("getCandidate",data);
    })

    socket.on('disconnect', () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                return;
            }
        }
        socket.to(roomID).emit('user_exit', {id: socket.id});
        console.log(users);
    })

    //여기까지 웹 RTC영상처리

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
