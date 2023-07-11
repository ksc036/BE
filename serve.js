import express from "express";
import cors from 'cors';


const app = express();

console.log("hello");
app.use(cors({ origin: 'http://localhost:8080'}));
app.get("/",(req,res) => res.send("home"));
 
app.listen(9000);