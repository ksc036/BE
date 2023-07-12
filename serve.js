import express from "express";
import http from "http";
import cors from 'cors';
import WebSocket,{WebSocketServer} from "ws";


const app = express();

console.log("hello");
app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("change"));
 
const handleListen = () => console.log("Listening on 9000");

const server = http.createServer(app);


const wss = new WebSocketServer({server});

wss.on("connection",(socket) =>{
console.log("Connected to Browser");
   socket.send("hello!!!");

   socket.on("close", ()=>{
    console.log("연결하나 끊어짐");
   })

   socket.on("message",(data)=>{
    console.log(data.toString());
   })
});

server.listen(9000, handleListen);