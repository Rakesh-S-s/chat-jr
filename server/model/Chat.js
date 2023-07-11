const mongoose = require("mongoose");

const Chat = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
},{
    collection: 'chat'
})

const model = mongoose.model("chat", Chat)
module.exports = model;