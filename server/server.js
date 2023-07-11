const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Chat = require('./model/Chat');
const User = require('./model/User');
const jwt = require("jsonwebtoken")
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_DB_URI,
 { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB connected')).catch(err => console.log(err));

 
app.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.pass
    })
    if(user){
        const token = jwt.sign({
            email: user.email
        }, 'secret')
        res.json({status:"ok", user: token})
    }else{
        res.json({status:"error", user:false})
    }
})

app.post("/register", async (req, res)=>{
    const data = req.body;
    try{
        const user = await User.create({
            email: req.body.email,
            password: req.body.pass,
        })
        res.json({status:"ok", user: user});
    }catch(err){
        res.json({status:"error", err: err})
    }
})

app.post("/message", async (req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const { message } = req.body;
        const chat = new Chat({ message:message, sender:email });
        await chat.save();
        res.json({data: chat, email: email});
    }catch(err){
        res.json(err)
    }
})

app.get("/message", async (req, res) => {
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token, 'secret')
        const email = decoded.email;
        const chat = await Chat.find();
        res.json({data: chat, user: token, email: email});
    }catch(err){
        res.json(err)
    }
})

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT );
})