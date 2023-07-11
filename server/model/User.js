const mongoose = require("mongoose")

const User = new mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
},{
    collection: "chat-user"
})

const model = mongoose.model("UserData", User);
module.exports = model;