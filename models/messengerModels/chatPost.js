const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatPostSchema = new Schema({
    chatId: String,
    userId: String,
    message: String,
    messageTime: String,
});

const chatPost = mongoose.model('chatPost', chatPostSchema);
module.exports = chatPost;